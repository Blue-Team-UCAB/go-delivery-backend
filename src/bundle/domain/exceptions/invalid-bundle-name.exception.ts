import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidBundleNameException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
