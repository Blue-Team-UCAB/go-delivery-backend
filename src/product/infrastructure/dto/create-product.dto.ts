import { IsString, IsNumber, IsPositive, IsOptional, IsArray, ArrayNotEmpty, ArrayMinSize, MinLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';

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

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value.split(',').map(item => item.trim());
      }
    }
    return value;
  })
  categories: string[];
}
