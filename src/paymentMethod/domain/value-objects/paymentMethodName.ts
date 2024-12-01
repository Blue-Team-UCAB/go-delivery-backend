import { ValueObject } from '../../../common/domain/value-object';
import { InvalidPaymentMethodNameException } from '../exceptions/invalid-paymentMethod-name.exception';

class PaymentMethodName implements ValueObject<PaymentMethodName> {
  private readonly _name: string;

  constructor(name: string) {
    if (name.length < 3 || !this.validate) throw new InvalidPaymentMethodNameException(`Name ${name} is not valid`);
    this._name = name;
  }

  equals(obj: PaymentMethodName): boolean {
    return this._name === obj._name;
  }

  validate(): boolean {
    return ['Binance', 'Zelle', 'PagoMovil'].includes(this._name);
  }

  get Name(): string {
    return this._name;
  }

  static create(name: string): PaymentMethodName {
    return new PaymentMethodName(name);
  }
}
