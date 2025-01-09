import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PushTokenDto {
  @ApiProperty({
    description: 'Token to send push notifications',
    example: 'xxxxxxxxxxxxxxxxxxxxxx',
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}
