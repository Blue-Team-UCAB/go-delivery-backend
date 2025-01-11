export interface GetBundleIdServiceResponseDto {
  name: string;
  description: string;
  currency: string;
  price: number;
  stock: number;
  weight: number;
  measurement: string;
  images: string[];
  caducityDate: Date;
  product: {
    id: string;
    name: string;
    price: number;
    weight: number;
    images: string[];
    quantity: number;
    //type: 'product' | 'bundle';
  }[];
  category: {
    id: string;
    name: string;
  }[];
  discount: {
    id: string;
    percentage: number;
  }[];
  //bundles: BundleProductResponseDto[];
}
