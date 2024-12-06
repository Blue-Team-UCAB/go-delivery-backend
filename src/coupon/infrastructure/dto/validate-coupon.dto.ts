import { IsString, Matches } from 'class-validator';

export class ValidateCouponDto {
  @IsString()
  @Matches(/^[A-Z0-9]+$/)
  code: string;
}
