import { ValueObject } from '../../../common/domain/value-object';
import { InvalidOrderBundlePriceException } from '../exceptions/invalid-order-bundle-price.exception';

export class OrderBundlePrice implements ValueObject<OrderBundlePrice> {
  private readonly _price: number;

  constructor(price: number) {
    if (price < 0) throw new InvalidOrderBundlePriceException(`Price ${price} is not valid`);
    this._price = price;
  }

  equals(obj: OrderBundlePrice): boolean {
    return this._price === obj._price;
  }

  get Price(): number {
    return this._price;
  }

  static create(price: number): OrderBundlePrice {
    return new OrderBundlePrice(price);
  }
}
