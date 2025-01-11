import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddDirecionEntryDto {
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

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Favorite direction',
    example: true,
  })
  favorite?: boolean;
}
