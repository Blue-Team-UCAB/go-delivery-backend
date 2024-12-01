import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidPaymentIdException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
