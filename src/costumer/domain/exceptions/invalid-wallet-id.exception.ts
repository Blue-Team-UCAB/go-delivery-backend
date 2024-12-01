import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidWalletIdException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
