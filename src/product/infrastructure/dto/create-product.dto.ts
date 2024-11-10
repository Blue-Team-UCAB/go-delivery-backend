import { IsString, MinLength, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(20)
  description: string;

  @IsString()
  @IsOptional()
  imageBuffer?: Buffer;

  @IsString()
  @IsOptional()
  contentType?: string;
}
