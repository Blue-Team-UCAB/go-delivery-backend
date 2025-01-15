export interface GetOrderPageServiceResponseDto {
  id: string;
  last_state: {
    state: string;
    date: Date;
  };
  totalAmount: number;
  summary_order: string;
}
