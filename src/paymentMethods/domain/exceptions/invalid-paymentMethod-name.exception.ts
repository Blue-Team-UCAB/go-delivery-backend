import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidPaymentMethodNameException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
