import { BundleProductDto } from './bundle-product-entry.dto';

export interface CreateBundleServiceEntryDto {
  name: string;
  description: string;
  currency: string;
  stock: number;
  imageBuffer?: Buffer;
  contentType?: string;
  caducityDate: Date;
  products: BundleProductDto[];
}
