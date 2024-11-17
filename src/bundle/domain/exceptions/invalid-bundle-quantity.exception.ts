import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidBundleQuantityException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
