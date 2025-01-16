import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class IaMakeRequestDto {
  @ApiProperty({
    type: String,
    example: 'User_id',
  })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    type: String,
    example: 'Hello, how are you?',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
