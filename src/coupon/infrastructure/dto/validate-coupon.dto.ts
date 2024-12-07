import { IsString, Matches } from 'class-validator';

export class ValidateCouponDto {
  @IsString()
  @Matches(/^[A-Za-z0-9]+$/)
  code: string;
}