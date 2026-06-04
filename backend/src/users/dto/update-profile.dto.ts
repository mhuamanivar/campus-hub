import { IsString, IsOptional, IsArray, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  career?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}

export class UpdateInterestsDto {
  @IsArray()
  @IsString({ each: true })
  interests: string[];
}
