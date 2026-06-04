import { IsString } from 'class-validator';

export class CheckinDto {
  @IsString()
  qrToken: string;
}
