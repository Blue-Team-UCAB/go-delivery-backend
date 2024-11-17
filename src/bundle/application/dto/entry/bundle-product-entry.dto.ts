export interface BundleProductDto {
  id: string;
  quantity: number;
  type: 'product' | 'bundle'; // Indica si es un producto individual o un combo
}
