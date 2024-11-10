import { ValueObject } from '../../../common/domain/value-object';
import { InvalidProductCurrencyException } from '../exceptions/invalid-product-currency.exception';

export class ProductCurrency implements ValueObject<ProductCurrency> {
  private readonly currency: string;

  constructor(currency: string) {
    if (!this.isValidCurrency(currency)) {
      throw new InvalidProductCurrencyException(`Currency ${currency} is not valid`);
    }
    this.currency = currency.toUpperCase();
  }

  equals(currency: ProductCurrency): boolean {
    return this.currency === currency.currency;
  }

  get Currency(): string {
    return this.currency;
  }

  private isValidCurrency(currency: string): boolean {
    const regex = /^[A-Za-z]{3}$/;
    return regex.test(currency);
  }

  static create(currency: string): ProductCurrency {
    return new ProductCurrency(currency);
  }
}
