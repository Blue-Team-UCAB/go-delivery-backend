import { Type } from 'class-transformer';
import { IsDate, IsString, IsNumber, Min, Max, MinLength, MaxLength, Matches, IsInt, IsPositive } from 'class-validator';

export class CreateCouponDto {
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
  porcentage: number;

  @IsString()
  @Matches(/^[A-Z0-9]+$/)
  code: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  title: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  message: string;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Min(1)
  numberUses: number;
}
