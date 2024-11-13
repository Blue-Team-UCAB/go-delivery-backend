import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidBundleProductQuantityException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
