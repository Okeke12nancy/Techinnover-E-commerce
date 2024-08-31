import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../module/products/entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from '../../module/user/entities/user.entity';
import { RedisService } from './redisService';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly redisService: RedisService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    userId: string,
  ): Promise<Product> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const product = this.productsRepository.create({
      ...createProductDto,
      user,
    });

    await this.productsRepository.save(product);

    const client = this.redisService.getClient();
    await client.del('products:all');

    return product;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ results: Product[]; total: number }> {
    const cacheKey = `products:all:${page}:${limit}`;
    const client = this.redisService.getClient(); // Get the Redis client

    const cachedProducts = await client.get(cacheKey);
    if (cachedProducts) {
      return JSON.parse(cachedProducts);
    }

    const [results, total] = await this.productsRepository.findAndCount({
      where: { approved: true },
      skip: (page - 1) * limit,
      take: limit,
    });

    await client.set(cacheKey, JSON.stringify({ results, total }), 'EX', 60);

    return { results, total };
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      select: ['id', 'name', 'price', 'description', 'quantity'],
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    userId: string,
  ): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    if (product.user.id !== userId)
      throw new UnauthorizedException('You can only update your own products');

    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }
  async remove(id: string, userId: string): Promise<void> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    if (product.user.id !== userId)
      throw new UnauthorizedException('You can only delete your own products');

    await this.productsRepository.remove(product);

    const client = this.redisService.getClient();
    await client.del('products:all');
  }

  async approve(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    product.approved = true;
    await this.productsRepository.save(product);

    const client = this.redisService.getClient();
    await client.del('products:all');

    return product;
  }
  async disapprove(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    product.approved = false;
    await this.productsRepository.save(product);

    const client = this.redisService.getClient();
    await client.del('products:all');

    return product;
  }
}
