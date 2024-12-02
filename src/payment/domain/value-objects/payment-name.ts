import { ValueObject } from '../../../common/domain/value-object';
import { InvalidPaymentNameException } from '../exceptions/invalid-payment-name.exception';

export class PaymentName implements ValueObject<PaymentName> {
  private readonly _name: string;

  constructor(name: string) {
    if (name.length < 4 || !this.validate) throw new InvalidPaymentNameException(`Name ${name} is not valid`);
    this._name = name;
  }

  equals(obj: PaymentName): boolean {
    return this._name === obj._name;
  }

  validate(): boolean {
    return ['Binance', 'Zelle', 'PagoMovil'].includes(this._name);
  }

  get Name(): string {
    return this._name;
  }

  static create(name: string): PaymentName {
    return new PaymentName(name);
  }
}
