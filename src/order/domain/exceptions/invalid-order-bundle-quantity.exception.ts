import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidOrderBundleQuantityException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
