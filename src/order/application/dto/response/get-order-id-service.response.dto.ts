export interface GetOrderIdServiceResponseDto {
  orderId: string;
  orderState: {
    state: string;
    date: Date;
  }[];
  orderTimeCreated: string;
  totalAmount: number;
  subTotal: number;
  orderReceivedDate?: Date;
  orderPayment?: {
    paymetAmount: number;
    paymentCurrency: string;
    paymentMethod: string;
  };
  orderDirection: DirectionDto;
  orderReport?: OrderReportDto;
  orderCourier?: CourierDto;
  products: ProductBundleDto[];
  bundles: ProductBundleDto[];
}

export class OrderReportDto {
  description: string;
}

export class DirectionDto {
  lat: number;
  long: number;
}

export class CourierDto {
  courierName: string;
  courierImage: string;
  phone: string;
}

export class ProductBundleDto {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  images: string[];
  currency: string;
}
