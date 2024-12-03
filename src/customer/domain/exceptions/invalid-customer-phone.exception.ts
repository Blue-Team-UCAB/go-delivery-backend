import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidCustomerPhoneException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
