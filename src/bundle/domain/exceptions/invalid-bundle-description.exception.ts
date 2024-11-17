import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidBundleDescriptionException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
