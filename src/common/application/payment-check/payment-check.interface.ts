import { PaymentDtoEntry } from './payment-entry.dto';

export interface IPaymentCheck {
  checkPayment(data: PaymentDtoEntry): Promise<boolean>;
}
