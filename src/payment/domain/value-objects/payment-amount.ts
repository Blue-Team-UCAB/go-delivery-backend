import { ValueObject } from 'src/common/domain/value-object';
import { InvalidPaymentAmountException } from '../exceptions/invalid-payment-amount.exception';

export class PaymentAmount implements ValueObject<PaymentAmount> {
  private readonly _amount: number;

  constructor(amount: number) {
    const amount2Decimal = Math.floor(amount * 100) / 100;
    if (amount2Decimal < 0) throw new InvalidPaymentAmountException(`Amount ${amount} is not valid`);
    this._amount = amount2Decimal;
  }

  equals(obj: PaymentAmount): boolean {
    return this._amount === obj._amount;
  }

  get Amount(): number {
    return this._amount;
  }

  static create(amount: number): PaymentAmount {
    return new PaymentAmount(amount);
  }
}
