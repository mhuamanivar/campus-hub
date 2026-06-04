import { IsString, IsEnum, IsInt, Min, IsDateString, IsOptional, IsUrl } from 'class-validator';
import { EventCategory } from '@prisma/client';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(EventCategory)
  category: EventCategory;

  @IsDateString()
  date: string;

  @IsString()
  location: string;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
