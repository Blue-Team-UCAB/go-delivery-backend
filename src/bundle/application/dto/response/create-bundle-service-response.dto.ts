export interface CreateBundleServiceResponseDto {
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
  categories: {
    id: string;
    name: string;
  }[];
}

export interface BundleProductResponseDto {
  id: string;
  name: string;
  price: number;
  weight: number;
  images: string[];
  quantity: number;
  //type: 'product' | 'bundle';
}
