export interface GetAllTransaccionResponseDto {
  type: string;
  date: Date;
  amount: number;
  method: string;
  debit: boolean;
}
