import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidCustomerException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
