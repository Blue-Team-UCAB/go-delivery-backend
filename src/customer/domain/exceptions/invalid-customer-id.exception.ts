import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidCustomerIdException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
