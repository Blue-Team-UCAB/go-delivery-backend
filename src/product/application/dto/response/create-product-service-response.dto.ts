export interface CreateProductServiceResponseDto {
  id: string;
  name: string;
  description: string;
  currency: string;
  price: number;
  stock: number;
  weight: number;
  measurement: string;
  imageUrl: string;
  categories: {
    id: string;
    name: string;
  }[];
}
