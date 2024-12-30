import { IsNotEmpty, IsString } from 'class-validator';

export class AddDirecionEntryDto {
  @IsString()
  @IsNotEmpty()
  direction: string;

  @IsString()
  @IsNotEmpty()
  latitude: string;

  @IsString()
  @IsNotEmpty()
  longitude: string;
}
