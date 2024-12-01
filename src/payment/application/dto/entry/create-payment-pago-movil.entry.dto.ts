export interface CreatePaymentPagoMovilEntryDto {
  phone: string;
  cedula: string;
  bank: string;
  amount: number;
  date: Date;
}
