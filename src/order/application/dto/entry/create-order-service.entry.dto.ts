export interface CreateOrderServiceEntryDto {
  id_customer: string;
  stripePaymentMethod?: string;
  id_stripe_customer?: string;
  paymentId: string;
  paymentMethod: string;
  idUserDirection: string;
  idCupon?: string;
  products: ProductBundleDto[];
  bundles?: ProductBundleDto[];
}

export class ProductBundleDto {
  id: string;
  quantity: number;
}
