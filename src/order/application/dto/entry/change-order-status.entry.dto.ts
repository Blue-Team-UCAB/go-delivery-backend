export interface ChangeOrderStatusEntryDto {
  orderId: string;
  status: string;
  linkedDivices: string[];
}