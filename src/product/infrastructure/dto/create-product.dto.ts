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

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductCategoryDto)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsedValue = JSON.parse(value);
        return parsedValue.map((item: any) => plainToInstance(ProductCategoryDto, item));
      } catch (error) {
        throw new Error('Invalid JSON string for categories');
      }
    }

    if (Array.isArray(value)) {
      return value.map(item => plainToInstance(ProductCategoryDto, item));
    }

    throw new Error('Invalid type for categories, expected string or array');
  })
  categories: ProductCategoryDto[];
}

export class ProductCategoryDto {
  @IsString()
  id: string;

  @IsString()
  @MinLength(3)
  name: string;
}
