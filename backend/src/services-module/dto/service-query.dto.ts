import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { ServiceCategory } from '@prisma/client';

export class ServiceQueryDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsEnum(ServiceCategory) category?: ServiceCategory;
  @IsOptional() @Transform(({ value }) => value === 'true') @IsBoolean() mine?: boolean;
}
