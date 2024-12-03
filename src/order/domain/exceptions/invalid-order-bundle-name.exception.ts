import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidOrderBundleNameException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
