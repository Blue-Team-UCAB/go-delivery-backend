import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNumber, IsDate, IsOptional, Matches } from 'class-validator';

export class PagoMovilEntryDto {
  @ApiProperty({
    description: 'Phone number of the customer',
    example: '584124567890',
  })
  @IsString()
  @Matches(/^58(412|414|424|416|426)\d{7}$/)
  phone: string;

  @ApiProperty({
    description: 'Identification number of the customer',
    example: '12345678',
  })
  @IsString()
  cedula: string;

  @ApiProperty({
    description: 'Bank of the customer',
    example: 'Banesco',
  })
  @IsString()
  bank: string;

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

  @ApiProperty({
    description: 'Date of the payment',
    example: '2021-01-01',
  })
  @IsDate()
  date: Date;
}
