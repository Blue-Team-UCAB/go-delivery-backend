import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidBundleCurrencyException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
