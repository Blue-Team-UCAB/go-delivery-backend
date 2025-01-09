export interface CreateDiscountServiceResponseDto {
  id: string;
  startDate: Date;
  expirationDate: Date;
  percentage: number;
  state: string;
  products: string[];
  bundles: string[];
  categories: string[];
}
