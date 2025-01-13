import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class UpdateCustomerEntryDto {
  @ApiProperty({
    description: 'The email address for the user',
    example: 'johndoe@example.com',
  })
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'The name for the new account',
    example: 'johndoe',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'The password for the user',
    example: 'securepassword123',
  })
  @IsString()
  @IsOptional()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&/#_.,:;()\-+])[A-Za-z\d@$!%*?&/#_.,:;()\-+]+$/)
  password?: string;

  @ApiProperty({
    description: 'The phone for the user',
    example: '584124567890',
  })
  @IsString()
  @IsOptional()
  @Matches(/^58(412|414|424|416|426)\d{7}$/)
  phone?: string;

  @IsOptional()
  imageBuffer?: Buffer;

  @IsOptional()
  contentType?: string;
}
