export interface BundleProductResponseDto {
  id: string;
  name: string;
  price: number;
  weight: number;
  quantity: number;
  type: 'product' | 'bundle';
}
