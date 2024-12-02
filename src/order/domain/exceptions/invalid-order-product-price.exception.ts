import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidOrderProductPriceException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
