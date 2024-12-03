import { ValueObject } from '../../../common/domain/value-object';
import { InvalidOrderProductQuantityException } from '../exceptions/invalid-order-product-quantity.exception';

export class OrderProductQuantity implements ValueObject<OrderProductQuantity> {
  private readonly _quantity: number;

  constructor(quantity: number) {
    if (quantity < 0) throw new InvalidOrderProductQuantityException(`Quantity ${quantity} is not valid`);
    this._quantity = quantity;
  }

  equals(obj: OrderProductQuantity): boolean {
    return this._quantity === obj._quantity;
  }

  get Quantity(): number {
    return this._quantity;
  }

  static create(quantity: number): OrderProductQuantity {
    return new OrderProductQuantity(quantity);
  }
}
