import { ValueObject } from '../../../common/domain/value-object';
import { InvalidPaymentDateException } from '../exceptions/invalid-payment-date.exception';

export class PaymentDate implements ValueObject<PaymentDate> {
  private readonly _date: Date;

  constructor(date: Date) {
    if (!date || date > new Date()) throw new InvalidPaymentDateException(`Date ${date} is not valid`);
    this._date = date;
  }

  equals(obj: PaymentDate): boolean {
    return this._date === obj._date;
  }

  get Date(): Date {
    return this._date;
  }

  static create(date: Date): PaymentDate {
    return new PaymentDate(date);
  }
}
