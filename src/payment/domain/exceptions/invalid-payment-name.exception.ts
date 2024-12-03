import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidPaymentNameException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
