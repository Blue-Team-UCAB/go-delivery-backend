import { IsString, IsNumber, IsPositive } from 'class-validator';

export class BundleProductDto {
  @IsString()
  id: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  // @IsString()
  // @IsIn(['product', 'bundle'])
  // type: 'product' | 'bundle';
}
