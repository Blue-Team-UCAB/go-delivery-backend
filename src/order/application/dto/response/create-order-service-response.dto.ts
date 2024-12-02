export interface CreateOrderServiceResponseDto {
  id: string;
  customerId: string;
  state: string;
  createdDate: Date;
  totalAmount: number;
  subtotalAmount: number;
  direction: DirectionDto;
  products: ProductBundleDto[];
  bundles: ProductBundleDto[];
}

export class DirectionDto {
  direction: string;
  longitude: number;
  latitude: number;
}

export class ProductBundleDto {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}
