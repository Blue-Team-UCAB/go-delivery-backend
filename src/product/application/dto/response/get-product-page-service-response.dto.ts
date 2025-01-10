export interface GetProductPageServiceResponseDto {
  products: {
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
  }[];
}
