import { IsOptional } from 'class-validator';

export class UpdateCustomerImageEntryDto {
  @IsOptional()
  imageBuffer?: Buffer;

  @IsOptional()
  contentType?: string;
}
