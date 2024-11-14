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
  @ValidateNested({ each: true }) // Valida cada instancia individualmente
  @Type(() => BundleProductDto) // Convierte cada elemento al tipo BundleProductDto
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsedValue = JSON.parse(value); // Parseamos si es un string
        console.log('Parsed products (string):', parsedValue);
        return parsedValue.map((item: any) => plainToInstance(BundleProductDto, item));
      } catch (error) {
        throw new Error('Invalid JSON string for products');
      }
    }

    if (Array.isArray(value)) {
      console.log('Products is already an array:', value);
      return value.map(item => plainToInstance(BundleProductDto, item)); // Convertimos cada elemento
    }

    throw new Error('Invalid type for products, expected string or array');
  })
  products: BundleProductDto[];

  @Type(() => Date)
  @IsDate()
  caducityDate: Date;
}
