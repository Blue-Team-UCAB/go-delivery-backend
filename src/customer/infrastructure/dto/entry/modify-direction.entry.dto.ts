import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

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
  lat: string;

  @ApiProperty({
    description: 'Longitude',
    example: '-12.123123',
  })
  @IsString()
  @IsNotEmpty()
  long: string;

  @ApiProperty({
    description: 'Favorite direction',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  favorite?: boolean;
}
