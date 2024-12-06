import { IsNotEmpty, IsString } from 'class-validator';

export class PushTokenDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
