export interface GetOrderPageServiceEntryDto {
  page: number;
  perpage: number;
  id_customer: string;
  status?: 'active' | 'past';
}
