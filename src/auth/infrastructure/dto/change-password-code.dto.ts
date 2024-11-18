import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordCodeDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  code: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&/#_.,:;()\-+])[A-Za-z\d@$!%*?&/#_.,:;()\-+]+$/)
  password: string;
}
