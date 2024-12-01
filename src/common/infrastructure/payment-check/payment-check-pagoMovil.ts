import { IPaymentCheck } from 'src/common/application/payment-check/payment-check.interface';
import { PaymentDtoEntry } from 'src/common/application/payment-check/payment-entry.dto';

export class PaymentCheckPagoMovil implements IPaymentCheck {
  async checkPayment(data: PaymentDtoEntry): Promise<boolean> {
    return true;
  }
}
