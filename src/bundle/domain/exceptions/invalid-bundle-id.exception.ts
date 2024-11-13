import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidBundleIdException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
