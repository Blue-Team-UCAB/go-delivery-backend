export interface GetProductIdServiceResponseDto {
  id: string;
  name: string;
  description: string;
  currency: string;
  price: number;
  stock: number;
  weight: number;
  imageUrl: string;
  categories: string[];
}
