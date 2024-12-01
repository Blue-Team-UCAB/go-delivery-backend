import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidPaymentMethodIdException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
