import { DomainException } from 'src/common/domain/domain-exeption';

export class InvalidProductException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
