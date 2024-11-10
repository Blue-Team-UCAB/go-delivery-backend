export interface CreateProductServiceEntryDto {
  name: string;
  description: string;
  imageBuffer?: Buffer;
  contentType?: string;
}
