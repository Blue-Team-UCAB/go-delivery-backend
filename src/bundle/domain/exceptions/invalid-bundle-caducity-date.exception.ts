import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidBundleCaducityDateException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
