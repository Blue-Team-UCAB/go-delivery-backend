import { ValueObject } from '../../../common/domain/value-object';
import { InvalidOrderProductNameException } from '../exceptions/invalid-order-product-name.exception';

export class OrderProductName implements ValueObject<OrderProductName> {
  private readonly _name: string;

  constructor(name: string) {
    if (name.length < 3) throw new InvalidOrderProductNameException(`Name ${name} is not valid`);
    this._name = name;
  }

  equals(obj: OrderProductName): boolean {
    return this._name === obj._name;
  }

  get Name(): string {
    return this._name;
  }

  static create(name: string): OrderProductName {
    return new OrderProductName(name);
  }
}
