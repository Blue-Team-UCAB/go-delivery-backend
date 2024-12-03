import { ValueObject } from '../../../common/domain/value-object';
import { InvalidPaymentIdException } from '../exceptions/invalid-payment-id.exception';

export class PaymentId implements ValueObject<PaymentId> {
  private readonly _id: string;

  constructor(id: string) {
    const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
    if (!regex.test(id)) throw new InvalidPaymentIdException(`ID ${id} is not valid`);
    this._id = id;
  }

  equals(obj: PaymentId): boolean {
    return this._id === obj._id;
  }

  get Id(): string {
    return this._id;
  }

  static create(id: string): PaymentId {
    return new PaymentId(id);
  }
}
