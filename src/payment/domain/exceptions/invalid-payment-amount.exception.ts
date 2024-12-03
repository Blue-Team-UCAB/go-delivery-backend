import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidPaymentAmountException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
