import { BundleProductResponseDto } from './bundle-product-response.dto';

export interface GetBundleIdServiceResponseDto {
  id: string;
  name: string;
  description: string;
  currency: string;
  price: number;
  stock: number;
  weight: number;
  imageUrl: string;
  caducityDate: Date;
  products: BundleProductResponseDto[];
  bundles: BundleProductResponseDto[];
}
