import { ValueObject } from 'src/common/domain/value-object';
import { InvalidWalletCurrencyException } from '../exceptions/invalid-wallet-currency.exception';

export class WalletCurrency implements ValueObject<WalletCurrency> {
  private readonly _currency: string;

  constructor(currency: string) {
    if (!['USD', 'VES'].includes(currency)) throw new InvalidWalletCurrencyException(`Currency ${currency} is not valid`);
    this._currency = currency;
  }

  equals(obj: WalletCurrency): boolean {
    return this._currency === obj._currency;
  }

  get Currency(): string {
    return this._currency;
  }

  static create(currency: string): WalletCurrency {
    return new WalletCurrency(currency);
  }
}
