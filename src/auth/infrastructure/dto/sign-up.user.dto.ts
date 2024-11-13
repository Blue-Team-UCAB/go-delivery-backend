import { IsString, Matches, MinLength } from 'class-validator';

export class SignUpUserDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  password: string;

  @IsString()
  @Matches(/^58[0-9]{10}$/)
  phone: string;
}
