import { IPaymentCheck } from 'src/common/application/payment-check/payment-check.interface';
import { PaymentDtoEntry } from 'src/common/application/payment-check/payment-entry.dto';

export class PaymentCheckZelle implements IPaymentCheck {
  async checkPayment(data: PaymentDtoEntry): Promise<number> {
    const valid = Math.random() < 0.5 ? 0 : 1;
    if (valid === 0) {
      return -1;
    }
    return data.amount;
  }
}
