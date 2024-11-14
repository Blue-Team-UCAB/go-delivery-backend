import { ValueObject } from '../../../common/domain/value-object';
import { InvalidBundlePriceException } from '../exceptions/invalid-bundle-price.exception';

export class BundlePrice implements ValueObject<BundlePrice> {
  private readonly _price: number;

  constructor(price: number) {
    if (price < 0) throw new InvalidBundlePriceException(`Price ${price} is not valid`);
    this._price = price;
  }

  equals(obj: BundlePrice): boolean {
    return this._price === obj._price;
  }

  get Price(): number {
    return this._price;
  }

  static create(price: number): BundlePrice {
    return new BundlePrice(price);
  }
}
