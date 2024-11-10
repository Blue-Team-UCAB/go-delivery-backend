import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidProductException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
