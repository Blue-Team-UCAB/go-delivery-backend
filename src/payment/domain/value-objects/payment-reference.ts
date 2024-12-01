import { ValueObject } from '../../../common/domain/value-object';
import { InvalidPaymentReferenceException } from '../exceptions/invalid-payment-reference.exception';

export class PaymentReference implements ValueObject<PaymentReference> {
  private readonly _refetence: string;

  constructor(ref: string) {
    if (ref.length < 4) throw new InvalidPaymentReferenceException(`Reference ${ref} is not valid`);
    this._refetence = ref;
  }

  equals(obj: PaymentReference): boolean {
    return this._refetence === obj._refetence;
  }

  get Reference(): string {
    return this._refetence;
  }

  static create(ref: string): PaymentReference {
    return new PaymentReference(ref);
  }
}
