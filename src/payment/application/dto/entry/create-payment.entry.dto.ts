export interface CreatePaymentEntryDto {
  idCustomer: string;
  phone?: string;
  cedula?: string;
  bank?: string;
  amount: number;
  reference: string;
  date?: Date;
  email?: string;
  typo: string;
}
