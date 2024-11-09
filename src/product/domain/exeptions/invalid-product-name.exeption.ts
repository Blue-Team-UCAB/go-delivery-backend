import { DomainException } from 'src/common/domain/domain-exeption';

export class InvalidProductNameException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
