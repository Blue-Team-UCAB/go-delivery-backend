import { ValueObject } from '../../../common/domain/value-object';
import { InvalidBundleCurrencyException } from '../exceptions/invalid-bundle-currency.exception';

export class BundleCurrency implements ValueObject<BundleCurrency> {
  private readonly _currency: string;

  constructor(currency: string) {
    if (!this.isValidCurrency(currency)) {
      throw new InvalidBundleCurrencyException(`Currency ${currency} is not valid`);
    }
    this._currency = currency.toUpperCase();
  }

  equals(obj: BundleCurrency): boolean {
    return this._currency === obj._currency;
  }

  get Currency(): string {
    return this._currency;
  }

  private isValidCurrency(currency: string): boolean {
    const regex = /^[A-Za-z]{3}$/;
    return regex.test(currency);
  }

  static create(currency: string): BundleCurrency {
    return new BundleCurrency(currency);
  }
}
