import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidProductPriceException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
