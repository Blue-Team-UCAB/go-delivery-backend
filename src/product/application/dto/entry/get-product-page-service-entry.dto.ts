export interface GetProductPageServiceEntryDto {
  page: number;
  perpage: number;
  category?: string;
  name?: string;
  price?: string;
  popular?: string;
  discount?: string;
}
