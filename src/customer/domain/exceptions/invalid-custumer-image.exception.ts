import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidCustomerImageException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
