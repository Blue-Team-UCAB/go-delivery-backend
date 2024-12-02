export interface CreateOrderServiceEntryDto {
  direction: string;
  longitude: number;
  latitude: number;
  customer: string;
  products: ProductBundleDto[];
  bundles: ProductBundleDto[];
}

export class ProductBundleDto {
  id: string;
  quantity: number;
}
