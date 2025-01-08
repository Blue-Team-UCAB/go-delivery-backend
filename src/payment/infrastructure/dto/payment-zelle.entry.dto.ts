import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNumber, Matches, IsEmail } from 'class-validator';

export class ZelleEntryDto {
  @ApiProperty({
    description: 'Email of the customer',
    example: 'hola@gmail.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Amount of the payment',
    example: 1000,
  })
  @Type(() => Number)
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Reference of the payment',
    example: '12345678',
  })
  @IsString()
  @Matches(/^[a-zA-Z0-9]{1,20}$/)
  reference: string;
}
