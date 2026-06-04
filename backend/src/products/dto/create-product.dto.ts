import { IsString, IsEnum, IsNumber, Min, IsOptional } from 'class-validator';
import { ProductCategory, ProductCondition } from '@prisma/client';

export class CreateProductDto {
  @IsString() title: string;
  @IsString() description: string;
  @IsEnum(ProductCategory) category: ProductCategory;
  @IsNumber() @Min(0) price: number;
  @IsEnum(ProductCondition) condition: ProductCondition;
  @IsOptional() @IsString() imageUrl?: string;
}

export class UpdateProductDto {
  @IsOptional() @IsString()              title?: string;
  @IsOptional() @IsString()              description?: string;
  @IsOptional() @IsEnum(ProductCategory) category?: ProductCategory;
  @IsOptional() @IsNumber() @Min(0)      price?: number;
  @IsOptional() @IsEnum(ProductCondition) condition?: ProductCondition;
}
