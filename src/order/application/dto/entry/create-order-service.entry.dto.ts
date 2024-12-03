export interface CreateOrderServiceEntryDto {
  direction: string;
  longitude: number;
  latitude: number;
  id_customer: string;
  token_stripe?: string;
  id_stripe_customer?: string;
  products: ProductBundleDto[];
  bundles?: ProductBundleDto[];
}

export class ProductBundleDto {
  id: string;
  quantity: number;
}
