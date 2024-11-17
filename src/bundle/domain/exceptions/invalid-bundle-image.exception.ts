import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidBundleImageException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
