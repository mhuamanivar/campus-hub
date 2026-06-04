import { IsEmail, IsString, MinLength, IsArray, ArrayMinSize } from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  career: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  interests: string[];
}
