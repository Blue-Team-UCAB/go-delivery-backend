import { plainToInstance, Transform, Type } from 'class-transformer';
import { ArrayMinSize, ArrayNotEmpty, IsArray, IsNumber, IsPositive, IsString, MinLength, ValidateNested } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @MinLength(10)
  direction: string;

  @IsNumber()
  @IsPositive()
  longitude: number;

  @IsNumber()
  @IsPositive()
  latitude: number;

  @IsString()
  customer: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductBundleDto)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsedValue = JSON.parse(value);
        return parsedValue.map((item: any) => plainToInstance(ProductBundleDto, item));
      } catch (error) {
        throw new Error('Invalid JSON string for products');
      }
    }

    if (Array.isArray(value)) {
      return value.map(item => plainToInstance(ProductBundleDto, item));
    }

    throw new Error('Invalid type for products, expected string or array');
  })
  products: ProductBundleDto[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  @Type(() => ProductBundleDto)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsedValue = JSON.parse(value);
        return parsedValue.map((item: any) => plainToInstance(ProductBundleDto, item));
      } catch (error) {
        throw new Error('Invalid JSON string for bundles');
      }
    }

    if (Array.isArray(value)) {
      return value.map(item => plainToInstance(ProductBundleDto, item));
    }

    throw new Error('Invalid type for bundles, expected string or array');
  })
  bundles: ProductBundleDto[];
}

export class ProductBundleDto {
  @IsString()
  id: string;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
