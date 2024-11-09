import { DomainException } from 'src/common/domain/domain-exeption';

export class InvalidProductDescriptionException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
