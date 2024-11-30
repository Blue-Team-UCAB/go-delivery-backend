import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsOptional()
  imageBuffer?: Buffer;

  @IsOptional()
  contentType?: string;
}
