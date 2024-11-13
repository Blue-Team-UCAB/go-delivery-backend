import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidBundleWeightException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
