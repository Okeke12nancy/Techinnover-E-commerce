// import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsString, IsNumber, Min, IsOptional } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({
    description: 'The name of the product',
    type: String,
    example: 'Sample Product',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The price of the product',
    type: Number,
    example: 99.99,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'A description of the product',
    type: String,
    example: 'This is a sample product.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The quantity of the product in stock',
    type: Number,
    example: 100,
  })
  @IsNumber()
  @Min(0)
  quantity: number;
}
