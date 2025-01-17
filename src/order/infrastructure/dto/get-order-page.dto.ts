import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class GetOrderPageDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  perpage: number = 10;

  @IsOptional()
  @IsString()
  @IsIn(['active', 'past'])
  state?: 'active' | 'past';
}
