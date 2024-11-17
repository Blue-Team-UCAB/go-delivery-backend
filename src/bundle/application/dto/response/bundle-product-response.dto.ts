export interface BundleProductResponseDto {
  id: string;
  name: string;
  price: number;
  weight: number;
  imageUrl: string;
  quantity: number;
  type: 'product' | 'bundle';
}
