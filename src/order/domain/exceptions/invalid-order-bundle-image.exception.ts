import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidOrderBundleImageException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
