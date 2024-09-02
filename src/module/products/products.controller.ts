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
  InternalServerErrorException,
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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product successfully created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Body() createProductDto: CreateProductDto,
    @Request() req: any,
  ) {
    const product = await this.productsService.create(
      createProductDto,
      req.user.id,
    );

    const response = {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      quantity: product.quantity,
      approved: product.approved,
    };

    return response;
  }

  @Get()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Get a list of all products' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved products' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const pageNumber = parseInt(page as any, 10) || 1;
    const limitNumber = parseInt(limit as any, 10) || 10;

    return this.productsService.findAll(pageNumber, limitNumber);
  }

  @Get('/admin')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Get a list of all products' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved products' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async getAllProductsForAdmin(
    @Request() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.productsService.findAllForAdmin(page, limit);
  }

  @Get('/user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Get a list of all products' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved products' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the product',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved product' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the product to update',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Product successfully updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req: any,
  ) {
    try {
      return await this.productsService.update(
        id,
        updateProductDto,
        req.user.id,
      );
    } catch (error) {
      console.error('Error in update controller:', error);
      throw new InternalServerErrorException(
        'An error occurred while updating the product',
      );
    }
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the product to delete',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Product successfully deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.productsService.remove(id, req.user.id);
  }

  @Patch(':id/admin/approve')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @SkipThrottle()
  @ApiOperation({ summary: 'Approve a product by ID (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the product to approve',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Product successfully approved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async approve(@Param('id') id: string) {
    return this.productsService.approve(id);
  }

  @Patch(':id/admin/disapprove')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @SkipThrottle()
  @ApiOperation({ summary: 'Disapprove a product by ID (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the product to disapprove',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Product successfully disapproved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async disapprove(@Param('id') id: string) {
    return this.productsService.disapprove(id);
  }
}
