import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidPaymentMethodReferenceException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
