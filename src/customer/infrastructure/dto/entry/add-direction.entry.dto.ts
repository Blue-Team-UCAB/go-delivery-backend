import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
  latitude: string;

  @ApiProperty({
    description: 'Longitude',
    example: '-12.123123',
  })
  @IsString()
  @IsNotEmpty()
  longitude: string;
}
