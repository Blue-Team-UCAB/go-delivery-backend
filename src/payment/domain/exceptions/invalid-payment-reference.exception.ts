import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidPaymentReferenceException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
