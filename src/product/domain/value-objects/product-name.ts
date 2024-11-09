import { ValueObject } from 'src/common/domain/value-object';
import { InvalidProductNameException } from '../exceptions/invalid-product-name.exception';

export class ProductName implements ValueObject<ProductName> {
  private readonly _name: string;

  constructor(name: string) {
    if (name.length < 3) throw new InvalidProductNameException(`Name ${name} is not valid`);
    this._name = name;
  }

  equals(obj: ProductName): boolean {
    return this._name === obj._name;
  }

  get Name(): string {
    return this._name;
  }

  static create(name: string): ProductName {
    return new ProductName(name);
  }
}
