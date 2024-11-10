import { ValueObject } from 'src/common/domain/value-object';
import { InvalidProductCurrencyException } from '../exceptions/invalid-product-currency.exception';

export class ProductCurrency implements ValueObject<ProductCurrency> {
  private readonly _currency: string;

  constructor(currrency: string) {
    if (currrency.length > 3) throw new InvalidProductCurrencyException(`Currency ${currrency} is not valid`);
    this._currency = currrency;
  }

  equals(obj: ProductCurrency): boolean {
    return this._currency === obj._currency;
  }

  get Currency(): string {
    return this._currency;
  }

  static create(currency: string): ProductCurrency {
    return new ProductCurrency(currency);
  }
}
