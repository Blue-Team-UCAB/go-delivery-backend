import { ValueObject } from 'src/common/domain/value-object';
import { InvalidProductPriceException } from '../exeptions/invalid-product-price.exeption';

export class ProductPrice implements ValueObject<ProductPrice> {
  private readonly _price: number;

  constructor(price: number) {
    if (price > 0.01) throw new InvalidProductPriceException(`Price ${price} is not valid`);
    this._price = price;
  }

  equals(obj: ProductPrice): boolean {
    return this._price === obj._price;
  }

  get Price(): number {
    return this._price;
  }

  static create(price: number): ProductPrice {
    return new ProductPrice(price);
  }
}
