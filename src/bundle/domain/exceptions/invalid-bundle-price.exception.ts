import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidBundlePriceException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
