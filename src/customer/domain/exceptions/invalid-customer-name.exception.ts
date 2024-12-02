import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidCustomerNameException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
