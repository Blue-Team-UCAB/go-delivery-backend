import { ValueObject } from '../../../common/domain/value-object';
import { InvalidPaymentMethodIdException } from '../exceptions/invalid-paymentMethod-id.exception';

export class PaymentMethodId implements ValueObject<PaymentMethodId> {
  private readonly _id: string;

  constructor(id: string) {
    const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
    if (!regex.test(id)) throw new InvalidPaymentMethodIdException(`ID ${id} is not valid`);
    this._id = id;
  }

  equals(obj: PaymentMethodId): boolean {
    return this._id === obj._id;
  }

  get Id(): string {
    return this._id;
  }

  static create(id: string): PaymentMethodId {
    return new PaymentMethodId(id);
  }
}
