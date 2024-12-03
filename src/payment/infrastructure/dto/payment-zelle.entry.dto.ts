import { Type } from 'class-transformer';
import { IsString, IsNumber, Matches, IsEmail } from 'class-validator';

export class ZelleEntryDto {
  @IsString()
  @IsEmail()
  email: string;

  @Type(() => Number)
  @IsNumber()
  amount: number;

  @IsString()
  @Matches(/^[a-zA-Z0-9]{1,20}$/)
  reference: string;
}
