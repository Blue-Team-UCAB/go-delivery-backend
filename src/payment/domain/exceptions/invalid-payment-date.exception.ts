import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidPaymentDateException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
