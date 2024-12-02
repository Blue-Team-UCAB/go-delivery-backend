import { Type } from 'class-transformer';
import { IsString, IsNumber, IsDate, IsOptional, Matches } from 'class-validator';

export class PagoMovilEntryDto {
  @IsString()
  @Matches(/^58(412|414|424|416|426)\d{7}$/)
  phone: string;

  @IsString()
  cedula: string;

  @IsString()
  bank: string;

  @Type(() => Number)
  @IsNumber()
  amount: number;

  @IsString()
  @Matches(/^[a-zA-Z0-9]{1,20}$/)
  reference: string;

  @IsDate()
  date: Date;
}
