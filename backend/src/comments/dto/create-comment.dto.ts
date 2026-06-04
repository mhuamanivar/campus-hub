import { IsString, MinLength, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  body: string;

  @IsOptional()
  @IsString()
  parentId?: string;
}
