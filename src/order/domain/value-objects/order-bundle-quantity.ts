import { ValueObject } from '../../../common/domain/value-object';
import { InvalidOrderBundleQuantityException } from '../exceptions/invalid-order-bundle-quantity.exception';

export class OrderBundleQuantity implements ValueObject<OrderBundleQuantity> {
  private readonly _quantity: number;

  constructor(quantity: number) {
    if (quantity < 0) throw new InvalidOrderBundleQuantityException(`Quantity ${quantity} is not valid`);
    this._quantity = quantity;
  }

  equals(obj: OrderBundleQuantity): boolean {
    return this._quantity === obj._quantity;
  }

  get Quantity(): number {
    return this._quantity;
  }

  static create(quantity: number): OrderBundleQuantity {
    return new OrderBundleQuantity(quantity);
  }
}
