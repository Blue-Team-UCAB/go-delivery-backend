export interface GetOrderPageServiceResponseDto {
  orders: {
    id: string;
    last_state: StateHistoryDto;
    totalAmount: number;
    summary_order: string;
  }[];
}

export class StateHistoryDto {
  state: string;
  date: Date;
}
