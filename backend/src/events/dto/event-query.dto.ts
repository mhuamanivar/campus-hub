import { IsOptional, IsString, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { EventCategory } from '@prisma/client';

export class EventQueryDto {
  @IsOptional() @IsString()
  search?: string;

  @IsOptional() @IsEnum(EventCategory)
  category?: EventCategory;

  @IsOptional() @IsEnum(['date', 'title', 'capacity'])
  sortBy?: 'date' | 'title' | 'capacity';

  @IsOptional() @IsString()
  cursor?: string;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(50)
  limit?: number;
}
