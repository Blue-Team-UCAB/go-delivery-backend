import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidOrderBundlePriceException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
