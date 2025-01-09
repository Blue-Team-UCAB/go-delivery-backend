import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'The email address for the user that lost the password',
    example: 'hola@gmail.com',
  })
  @IsString()
  @IsEmail()
  email: string;
}
