export interface GetOrderIdServiceResponseDto {
  id: string;
  state: StateHistoryDto[];
  totalAmount: number;
  subtotalAmount: number;
  courier?: CourierDto;
  report?: OrderReportDto;
  direction: DirectionDto;
  products: ProductBundleDto[];
  bundles: ProductBundleDto[];
}

export class CourierDto {
  id: string;
  name: string;
  phone: string;
  image: string;
}

export class OrderReportDto {
  claimDate: Date;
  claim: string;
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
