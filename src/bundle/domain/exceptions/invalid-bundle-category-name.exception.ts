import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidBundleCategoryNameException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
