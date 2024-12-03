import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidWalletAmountException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
