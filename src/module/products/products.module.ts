import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from '../../module/products/entities/product.entity';
import { User } from '../../module/user/entities/user.entity';
// import { RedisModule } from 'nestjs-redis';
import { RedisService } from './redisService';

@Module({
  imports: [TypeOrmModule.forFeature([Product, User])],
  controllers: [ProductsController],
  providers: [ProductsService, RedisService],
})
export class ProductsModule {}
