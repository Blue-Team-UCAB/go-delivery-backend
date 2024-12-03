import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidPaymentException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
