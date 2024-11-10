import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidProductNameException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
