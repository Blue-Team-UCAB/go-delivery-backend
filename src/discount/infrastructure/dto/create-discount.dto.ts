import { Transform, Type } from 'class-transformer';
import { IsArray, IsDate, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateDiscountDto {
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  expirationDate: Date;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  products?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  bundles?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];
}
