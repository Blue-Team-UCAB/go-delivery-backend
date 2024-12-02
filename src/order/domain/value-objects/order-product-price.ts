import { ValueObject } from '../../../common/domain/value-object';
import { InvalidOrderProductPriceException } from '../exceptions/invalid-order-product-price.exception';

export class OrderProductPrice implements ValueObject<OrderProductPrice> {
  private readonly _price: number;

  constructor(price: number) {
    if (price < 0.01) throw new InvalidOrderProductPriceException(`Price ${price} is not valid`);
    this._price = price;
  }

  equals(obj: OrderProductPrice): boolean {
    return this._price === obj._price;
  }

  get Price(): number {
    return this._price;
  }

  static create(price: number): OrderProductPrice {
    return new OrderProductPrice(price);
  }
}
