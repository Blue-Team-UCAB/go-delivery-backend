import { ValueObject } from '../../../common/domain/value-object';
import { InvalidBundleQuantityException } from '../exceptions/invalid-bundle-quantity.exception';

export class BundleQuantity implements ValueObject<BundleQuantity> {
  private readonly _quantity: number;

  constructor(quantity: number) {
    if (quantity < 0) throw new InvalidBundleQuantityException(`Quantity ${quantity} is not valid`);
    this._quantity = quantity;
  }

  equals(obj: BundleQuantity): boolean {
    return this._quantity === obj._quantity;
  }

  get Quantity(): number {
    return this._quantity;
  }

  static create(quantity: number): BundleQuantity {
    return new BundleQuantity(quantity);
  }
}
