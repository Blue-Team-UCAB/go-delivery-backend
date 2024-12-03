export interface CreateOrderServiceResponseDto {
  id: string;
  state: StateHistoryDto[];
  totalAmount: number;
  subtotalAmount: number;
  direction: DirectionDto;
  products: ProductBundleDto[];
  bundles: ProductBundleDto[];
}

export class StateHistoryDto {
  state: string;
  date: Date;
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
