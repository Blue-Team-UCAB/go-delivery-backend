import { DomainException } from 'src/common/domain/domain-exeption';

export class InvalidProductPriceException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}