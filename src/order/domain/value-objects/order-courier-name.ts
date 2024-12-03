import { ValueObject } from '../../../common/domain/value-object';
import { InvalidOrderCourierNameException } from '../exceptions/invalid-order-courier-name.exception';

export class OrderCourierName implements ValueObject<OrderCourierName> {
  private readonly _name: string;

  constructor(name: string) {
    if (name.length < 3) throw new InvalidOrderCourierNameException(`Name ${name} is not valid`);
    this._name = name;
  }

  equals(obj: OrderCourierName): boolean {
    return this._name === obj._name;
  }

  get Name(): string {
    return this._name;
  }

  static create(name: string): OrderCourierName {
    return new OrderCourierName(name);
  }
}
