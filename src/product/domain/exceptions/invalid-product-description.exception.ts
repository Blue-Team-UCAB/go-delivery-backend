import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidProductDescriptionException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
