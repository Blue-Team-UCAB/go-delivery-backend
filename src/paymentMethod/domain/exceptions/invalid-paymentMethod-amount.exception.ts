import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidPaymentMethodDateException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
