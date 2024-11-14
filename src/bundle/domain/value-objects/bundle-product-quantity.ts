import { ValueObject } from '../../../common/domain/value-object';
import { InvalidBundleProductQuantityException } from '../exceptions/invalid-bundle-product-quantity.exception';

export class BundleProductQuantity implements ValueObject<BundleProductQuantity> {
  private readonly _quantity: number;

  constructor(quantity: number) {
    if (quantity < 0) throw new InvalidBundleProductQuantityException(`Quantity ${quantity} is not valid`);
    this._quantity = quantity;
  }

  equals(obj: BundleProductQuantity): boolean {
    return this._quantity === obj._quantity;
  }

  get Quantity(): number {
    return this._quantity;
  }

  static create(quantity: number): BundleProductQuantity {
    return new BundleProductQuantity(quantity);
  }
}
