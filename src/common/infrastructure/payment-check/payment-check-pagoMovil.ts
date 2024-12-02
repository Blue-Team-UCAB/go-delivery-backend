import { IPaymentCheck } from 'src/common/application/payment-check/payment-check.interface';
import { PaymentDtoEntry } from 'src/common/application/payment-check/payment-entry.dto';
import { ApiBCV } from '../providers/services/payment-banco-central.api.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentCheckPagoMovil implements IPaymentCheck {
  constructor(private apiBcv: ApiBCV) {}
  async checkPayment(data: PaymentDtoEntry): Promise<number> {
    const valid = Math.random() < 0.5 ? 0 : 1;
    if (valid === 0) {
      return -1;
    }
    const PrecioDolar = await this.apiBcv.getDolar();
    return data.amount / PrecioDolar;
  }
}
