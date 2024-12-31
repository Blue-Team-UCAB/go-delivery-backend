import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ModifyDirectionEntryDto {
  @IsString()
  @IsUUID()
  directionId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

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
