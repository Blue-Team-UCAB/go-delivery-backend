export interface CreateOrderServiceEntryDto {
  direction: string;
  longitude: number;
  latitude: number;
  token: string;
  token_stripe?: string;
  products: ProductBundleDto[];
  bundles?: ProductBundleDto[];
}

export class ProductBundleDto {
  id: string;
  quantity: number;
}
