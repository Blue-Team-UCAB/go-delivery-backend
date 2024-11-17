import { IsString, IsNumber, IsPositive, IsIn } from 'class-validator';

export class BundleProductDto {
  @IsString()
  id: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsString()
  @IsIn(['product', 'bundle'])
  type: 'product' | 'bundle';
}
