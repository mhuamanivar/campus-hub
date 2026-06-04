import { IsString, IsEnum, IsInt, Min, IsDateString, IsOptional, IsUrl, IsBoolean } from 'class-validator';
import { EventCategory } from '@prisma/client';

export class UpdateEventDto {
  @IsOptional() @IsString()   title?: string;
  @IsOptional() @IsString()   description?: string;
  @IsOptional() @IsEnum(EventCategory) category?: EventCategory;
  @IsOptional() @IsDateString()        date?: string;
  @IsOptional() @IsString()   location?: string;
  @IsOptional() @IsInt() @Min(1)       capacity?: number;
  @IsOptional() @IsUrl()               imageUrl?: string;
  @IsOptional() @IsBoolean()           isPublished?: boolean;
}
