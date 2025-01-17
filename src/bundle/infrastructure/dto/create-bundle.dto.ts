import { IsString, IsNumber, IsPositive, IsOptional, IsArray, ArrayNotEmpty, ArrayMinSize, MinLength, IsDate, ValidateNested } from 'class-validator';
import { plainToInstance, Transform, Type } from 'class-transformer';
import { BundleProductDto } from './bundle-product.dto';

export class CreateBundleDto {
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
  stock: number;

  @IsOptional()
  imageBuffer?: Buffer;

  @IsOptional()
  contentType?: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BundleProductDto)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsedValue = JSON.parse(value);
        return parsedValue.map((item: any) => plainToInstance(BundleProductDto, item));
      } catch (error) {
        throw new Error('Invalid JSON string for products');
      }
    }

    if (Array.isArray(value)) {
      return value.map(item => plainToInstance(BundleProductDto, item));
    }

    throw new Error('Invalid type for products, expected string or array');
  })
  products: BundleProductDto[];

  @Type(() => Date)
  @IsDate()
  caducityDate: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories: string[];
}
