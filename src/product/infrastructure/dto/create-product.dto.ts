import { IsString, IsNumber, IsPositive, IsOptional, IsArray, ArrayNotEmpty, ArrayMinSize, MinLength, ValidateNested } from 'class-validator';
import { plainToInstance, Transform, Type } from 'class-transformer';

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

  @IsString()
  @MinLength(2)
  measurement: string;

  @IsOptional()
  imageBuffer?: Buffer;

  @IsOptional()
  contentType?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories: string[];
}
