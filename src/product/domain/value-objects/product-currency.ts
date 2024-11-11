import { ValueObject } from '../../../common/domain/value-object';
import { InvalidProductCurrencyException } from '../exceptions/invalid-product-currency.exception';

export class ProductCurrency implements ValueObject<ProductCurrency> {
  private readonly _currency: string;

  constructor(currency: string) {
    if (!this.isValidCurrency(currency)) {
      throw new InvalidProductCurrencyException(`Currency ${currency} is not valid`);
    }
    this._currency = currency.toUpperCase();
  }

  equals(obj: ProductCurrency): boolean {
    return this._currency === obj._currency;
  }

  get Currency(): string {
    return this._currency;
  }

  private isValidCurrency(currency: string): boolean {
    const regex = /^[A-Za-z]{3}$/;
    return regex.test(currency);
  }

  static create(currency: string): ProductCurrency {
    return new ProductCurrency(currency);
  }
}
