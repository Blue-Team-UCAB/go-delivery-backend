import { Type } from 'class-transformer';
import { IsString, MinLength, IsOptional, IsNumber, IsPositive } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(20)
  description: string;

  @IsString()
  @MinLength(3)
  currency: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  stock: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  weight: number;

  @IsOptional()
  imageBuffer?: Buffer;

  @IsOptional()
  contentType?: string;
}
