import { DomainException } from 'src/common/domain/domain-exeption';

export class InvalidProductIdException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
