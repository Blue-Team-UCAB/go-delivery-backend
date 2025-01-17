import { IsString, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class BundleProductDto {
  @IsString()
  @IsUUID()
  id: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  // @IsString()
  // @IsIn(['product', 'bundle'])
  // type: 'product' | 'bundle';
}
