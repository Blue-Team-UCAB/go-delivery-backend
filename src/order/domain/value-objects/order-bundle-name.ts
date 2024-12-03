import { ValueObject } from '../../../common/domain/value-object';
import { InvalidOrderBundleNameException } from '../exceptions/invalid-order-bundle-name.exception';

export class OrderBundleName implements ValueObject<OrderBundleName> {
  private readonly _name: string;

  constructor(name: string) {
    if (name.length < 3) throw new InvalidOrderBundleNameException(`Name ${name} is not valid`);
    this._name = name;
  }

  equals(obj: OrderBundleName): boolean {
    return this._name === obj._name;
  }

  get Name(): string {
    return this._name;
  }

  static create(name: string): OrderBundleName {
    return new OrderBundleName(name);
  }
}
