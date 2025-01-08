import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class SignUpUserDto {
  @ApiProperty({
    description: 'The email address for the user',
    example: 'johndoe@example.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The name for the new account',
    example: 'johndoe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The password for the user',
    example: 'securepassword123',
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&/#_.,:;()\-+])[A-Za-z\d@$!%*?&/#_.,:;()\-+]+$/)
  password: string;

  @ApiProperty({
    description: 'The phone for the user',
    example: '584124567890',
  })
  @IsString()
  @Matches(/^58(412|414|424|416|426)\d{7}$/)
  phone: string;

  @ApiProperty({
    description: 'Type of user',
    example: 'Admin',
  })
  @IsString()
  @IsOptional()
  type?: string;
}
