export interface CreateBundleServiceEntryDto {
  name: string;
  description: string;
  currency: string;
  stock: number;
  imageBuffer?: Buffer;
  contentType?: string;
  caducityDate: Date;
  products: {
    id: string;
    quantity: number;
  }[];
  categories: string[];
}
