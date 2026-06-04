import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ProductCategory, ProductCondition } from '@prisma/client';

export class ProductQueryDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsEnum(ProductCategory) category?: ProductCategory;
  @IsOptional() @IsEnum(ProductCondition) condition?: ProductCondition;
}
