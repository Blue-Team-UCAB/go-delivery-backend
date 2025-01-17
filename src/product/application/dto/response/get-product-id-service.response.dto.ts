export interface GetProductIdServiceResponseDto {
  name: string;
  description: string;
  currency: string;
  price: number;
  stock: number;
  weight: number;
  measurement: string;
  images: string[];
  category: {
    id: string;
    name: string;
  }[];
  discount: {
    id: string;
    percentage: number;
  }[];
  caducityDate?: Date;
}
