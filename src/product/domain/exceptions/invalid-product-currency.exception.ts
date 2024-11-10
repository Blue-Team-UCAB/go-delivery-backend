import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidProductCurrencyException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
