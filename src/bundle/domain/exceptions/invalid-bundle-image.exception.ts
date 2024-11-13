import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidBundleImagenException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
