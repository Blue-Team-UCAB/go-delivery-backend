import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordCodeDto {
  @ApiProperty({
    description: 'The email address for the user',
    example: 'Hola@gmail.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The code for the user send to email',
    example: '123',
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'The new password for the user',
    example: 'Securepassword123',
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&/#_.,:;()\-+])[A-Za-z\d@$!%*?&/#_.,:;()\-+]+$/)
  password: string;
}
