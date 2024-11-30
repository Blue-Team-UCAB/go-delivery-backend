import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidWalletCurrencyException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
