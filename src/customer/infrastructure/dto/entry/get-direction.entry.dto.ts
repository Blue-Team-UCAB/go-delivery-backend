import { IsNotEmpty, IsString } from 'class-validator';

export class GetDirectionEntryDto {
  @IsString()
  @IsNotEmpty()
  idDirection: string;
}
