export interface GetBundlePageServiceResponseDto {
  id: string;
  name: string;
  description: string;
  currency: string;
  price: number;
  stock: number;
  weight: number;
  measurement: string;
  images: string[];
  discount: {
    id: string;
    percentage: number;
  }[];
}
