export interface CreateProductServiceEntryDto {
  name: string;
  description: string;
  currency: string;
  price: number;
  stock: number;
  weight: number;
  imageBuffer?: Buffer;
  contentType?: string;
  categories: string[];
}
