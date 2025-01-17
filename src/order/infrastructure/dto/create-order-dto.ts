import { ApiProperty } from '@nestjs/swagger';
import { plainToInstance, Transform, Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsPositive, IsString, IsUUID, MinLength, ValidateNested } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Payment identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsUUID()
  @IsOptional()
  paymentId?: string;

  @ApiProperty({
    description: 'Payment method',
    example: 'credit_card',
  })
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @ApiProperty({
    description: 'Customer address identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsUUID()
  idUserDirection: string;

  @ApiProperty({
    description: 'Stripe token',
    example: 'pm_1J4J9v2eZvKYlo2C5J9v2eZv',
  })
  @IsOptional()
  @IsString()
  stripePaymentMethod: string;

  @ApiProperty({
    description: 'Coupon identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  idCupon: string;

  @ApiProperty({
    description: 'Products to add to the order',
    example: '[{"id":"123e4567-e89b-12d3-a456-426614174000","quantity":2}]',
  })
  @IsOptional()
  @IsArray()
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
  products?: ProductBundleDto[];

  @ApiProperty({
    description: 'Bundles to add to the order',
    example: '[{"id":"123e4567-e89b-12d3-a456-426614174000","quantity":2}]',
  })
  @IsOptional()
  @IsArray()
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
  bundles?: ProductBundleDto[];
}

export class ProductBundleDto {
  @IsString()
  @IsUUID()
  id: string;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
