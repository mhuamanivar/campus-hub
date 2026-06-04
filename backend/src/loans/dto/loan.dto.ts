import { IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { LoanStatus } from '@prisma/client';

export class CreateLoanDto {
  @IsString() resourceId: string;
  @IsDateString() dueDate: string;
  @IsOptional() @IsString() notes?: string;
}

export class CreateResourceDto {
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @IsString() code: string;
  @IsOptional() @IsString() imageUrl?: string;
}

export class UpdateLoanDto {
  @IsEnum(LoanStatus) status: LoanStatus;
}
