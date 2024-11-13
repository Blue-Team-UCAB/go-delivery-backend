import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class SignUpUserDto {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&/#_.,:;()\-+])[A-Za-z\d@$!%*?&/#_.,:;()\-+]+$/)
  password: string;

  @IsString()
  @Matches(/^58[0-9]{10}$/)
  phone: string;
}
