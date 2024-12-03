export interface CreateOrderServiceEntryDto {
  direction: string;
  longitude: number;
  latitude: number;
  token_customer: string;
  token_stripe?: string;
  token_stripe_customer?: string;
  products: ProductBundleDto[];
  bundles?: ProductBundleDto[];
}

export class ProductBundleDto {
  id: string;
  quantity: number;
}
