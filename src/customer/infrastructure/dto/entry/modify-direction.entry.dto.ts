import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ModifyDirectionEntryDto {
  @ApiProperty({
    description: 'Direction ID',
    example: '123e4567-e',
  })
  @IsString()
  @IsUUID()
  directionId: string;

  @ApiProperty({
    description: 'Name of the direction',
    example: 'Home',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Direction',
    example: 'Calle 123',
  })
  @IsString()
  @IsNotEmpty()
  direction: string;

  @ApiProperty({
    description: 'Latitude',
    example: '-12.123123',
  })
  @IsString()
  @IsNotEmpty()
  latitude: string;

  @ApiProperty({
    description: 'Longitude',
    example: '-12.123123',
  })
  @IsString()
  @IsNotEmpty()
  longitude: string;
}
