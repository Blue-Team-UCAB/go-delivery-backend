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
  @Matches(/^58(412|414|424|416|426)\d{7}$/)
  phone: string;
}
