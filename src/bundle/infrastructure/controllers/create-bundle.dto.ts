import { IsString, IsNumber, IsPositive, IsOptional, IsArray, ArrayNotEmpty, ArrayMinSize, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { BundleProductDto } from '../../../bundle/infrastructure/dto/bundle-product.dto';

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
  @Type(() => BundleProductDto)
  products: BundleProductDto[];

  @IsNumber()
  @IsPositive()
  caducityDate: Date;
}
