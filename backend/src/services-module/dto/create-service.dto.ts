import { IsString, IsEnum, IsNumber, Min, IsOptional } from 'class-validator';
import { ServiceCategory, PriceType } from '@prisma/client';

export class CreateServiceDto {
  @IsString() title: string;
  @IsString() description: string;
  @IsEnum(ServiceCategory) category: ServiceCategory;
  @IsNumber() @Min(0) price: number;
  @IsEnum(PriceType) priceType: PriceType;
}

export class UpdateServiceDto {
  @IsOptional() @IsString()             title?: string;
  @IsOptional() @IsString()             description?: string;
  @IsOptional() @IsEnum(ServiceCategory) category?: ServiceCategory;
  @IsOptional() @IsNumber() @Min(0)     price?: number;
  @IsOptional() @IsEnum(PriceType)      priceType?: PriceType;
}

export class RequestServiceDto {
  @IsString() message: string;
}
