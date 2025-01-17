export interface CreateDiscountServiceEntryDto {
  startDate: Date;
  expirationDate: Date;
  percentage: number;
  products?: string[];
  bundles?: string[];
  categories?: string[];
}
