export interface CreateOrderServiceEntryDto {
  id_direction: string;
  id_customer: string;
  token_stripe?: string;
  id_stripe_customer?: string;
  id_coupon?: string;
  products: ProductBundleDto[];
  bundles?: ProductBundleDto[];
}

export class ProductBundleDto {
  id: string;
  quantity: number;
}
