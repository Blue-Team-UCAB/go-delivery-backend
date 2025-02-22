import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidWalletException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
