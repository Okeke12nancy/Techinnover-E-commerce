import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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
import { UserListResponseDto } from '../user/dto/user-list.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private redisService: RedisService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    userId: string,
  ): Promise<Product> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (!user) throw new NotFoundException('User not found');

      const product = this.productsRepository.create({
        ...createProductDto,
        user,
      });

      await this.productsRepository.save(product);

      const client = this.redisService.getClient();
      await client.del('products:all');

      return product;
    } catch {
      throw new InternalServerErrorException(
        'An error occurred while creating the product',
      );
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ results: Product[]; total: number }> {
    const cacheKey = `products:all:${page}:${limit}`;
    const client = this.redisService.getClient();

    try {
      const cachedProducts = await client.get(cacheKey);
      if (cachedProducts) {
        return JSON.parse(cachedProducts);
      }

      const [results, total] = await this.productsRepository.findAndCount({
        where: { approved: true },
        relations: ['user'],
        skip: (page - 1) * limit,
        take: limit,
      });

      results.forEach((product) => {
        if (product.user) {
          delete product.user.password;
        }
      });

      await client.set(cacheKey, JSON.stringify({ results, total }), 'EX', 60);

      return { results, total };
    } catch (error) {
      console.error('Error in findAll:', error.message);
      throw new InternalServerErrorException('Error retrieving products');
    }
  }

  async findAllForAdmin(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    message: string;
    users: UserListResponseDto[];
    total: number;
    totalPages: number;
  }> {
    try {
      console.log('Calling usersService.findAll()');

      page = Number(page);
      limit = Number(limit);

      if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new BadRequestException(
          'Page and limit must be positive numbers',
        );
      }

      const skip = (page - 1) * limit;

      const [users, total] = await this.usersRepository.findAndCount({
        skip,
        take: limit,
      });

      console.log('Users retrieved:', users);

      const userDtos: UserListResponseDto[] = users.map((user: User) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isBanned: user.isBanned,
      }));

      const totalPages = Math.ceil(total / limit);

      return {
        message: 'Users successfully fetched',
        users: userDtos,
        total,
        totalPages,
      };
    } catch (error) {
      console.error('Error retrieving users:', error);
      throw new BadRequestException('Unable to retrieve users');
    }
  }

  async findUserProducts(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ products: Product[]; total: number }> {
    try {
      const [products, total] = await this.productsRepository.findAndCount({
        where: { user: { id: userId } },
        relations: ['user'],
        select: ['id', 'name', 'price', 'description', 'quantity', 'user'],
        skip: (page - 1) * limit,
        take: limit,
      });

      products.forEach((product) => {
        if (product.user) {
          delete product.user.password;
        }
      });

      return { products, total };
    } catch (error) {
      console.error('Error in findUserProducts:', error.message);
      throw new InternalServerErrorException('Error retrieving user products');
    }
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      select: ['id', 'name', 'price', 'description', 'quantity'],
    });
    if (!product) throw new NotFoundException('Product not found');
    delete product.user.password;
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    userId: string,
  ): Promise<Product> {
    try {
      console.log('Update Product ID:', id);
      console.log('Update DTO:', updateProductDto);
      console.log('User ID:', userId);

      const product = await this.productsRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      if (!product) throw new NotFoundException('Product not found');

      if (product.user.id !== userId) {
        throw new UnauthorizedException(
          'You can only update your own products',
        );
      }

      Object.assign(product, updateProductDto);

      console.log('Product before save:', product);
      const updatedProduct = await this.productsRepository.save(product);

      if (updatedProduct.user) {
        delete updatedProduct.user.password;
      }

      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      throw new InternalServerErrorException(
        'An error occurred while updating the product',
      );
    }
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    if (product.user.id !== userId)
      throw new UnauthorizedException('You can only delete your own products');

    await this.productsRepository.remove(product);

    const client = this.redisService.getClient();
    await client.del('products:all');

    return { message: 'Product successfully deleted' };
  }

  async approve(id: string): Promise<Product> {
    try {
      const product = await this.productsRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      if (!product) throw new NotFoundException('Product not found');

      product.approved = true;
      await this.productsRepository.save(product);

      const client = this.redisService.getClient();
      await client.del('products:all');

      if (product.user) {
        delete product.user.password;
      }

      return product;
    } catch (error) {
      console.error('Error approving product:', error);
      throw new InternalServerErrorException(
        'An error occurred while approving the product',
      );
    }
  }

  async disapprove(id: string): Promise<Product> {
    try {
      const product = await this.productsRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      if (!product) throw new NotFoundException('Product not found');

      product.approved = false;
      await this.productsRepository.save(product);

      const client = this.redisService.getClient();
      await client.del('products:all');

      if (product.user) {
        delete product.user.password;
      }

      return product;
    } catch (error) {
      console.error('Error disapproving product:', error);
      throw new InternalServerErrorException(
        'An error occurred while disapproving the product',
      );
    }
  }
}
