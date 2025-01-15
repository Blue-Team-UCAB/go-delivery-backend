export interface CreateOrderServiceResponseDto {
  id: string;
  orderState: StateHistoryDto[];
  orderCreatedDate: Date;
  orderTimeCreated: string;
  totalAmount: number;
  subtotalAmount: number;
  currency: string;
  orderDirection: DirectionDto;
  products: ProductBundleDto[];
  bundles: ProductBundleDto[];
  orderPayment: {
    amount: number;
    currency: string;
    paymentMethod: string;
  };
}

export class StateHistoryDto {
  state: string;
  date: Date;
}

export class DirectionDto {
  lat: number;
  long: number;
}

export class ProductBundleDto {
  id: string;
  name: string;
  price: number;
  images: string[];
  quantity: number;
  currency: string;
}
