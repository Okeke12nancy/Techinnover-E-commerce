import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/auth.jwt.strategy';
import { Roles } from '../../common/decorators/decorators.guards';
import { Role } from '../../common/enum';
import { RolesGuard } from '../../common/guards/roles.guards';

import { SkipThrottle } from '@nestjs/throttler';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async create(
    @Body() createProductDto: CreateProductDto,
    @Request() req: any,
  ) {
    return this.productsService.create(createProductDto, req.user.id);
  }

  @Get()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.productsService.findAll(page, limit);
  }

  @Get(':id')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async findById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req: any,
  ) {
    return this.productsService.update(id, updateProductDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.productsService.remove(id, req.user.id);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @SkipThrottle()
  async approve(@Param('id') id: string) {
    return this.productsService.approve(id);
  }

  @Patch(':id/disapprove')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @SkipThrottle()
  async disapprove(@Param('id') id: string) {
    return this.productsService.disapprove(id);
  }
}
