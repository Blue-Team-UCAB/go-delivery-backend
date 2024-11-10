import { ValueObject } from 'src/common/domain/value-object';
import { InvalidCategoryNameException } from '../exceptions/invalid-category-name.exception';

export class CategoryName implements ValueObject<CategoryName> {
  private readonly _name: string;

  constructor(name: string) {
    if (name.length < 3) throw new InvalidCategoryNameException(`Name ${name} is not valid`);
    this._name = name;
  }

  equals(obj: CategoryName): boolean {
    return this._name === obj._name;
  }

  get Name(): string {
    return this._name;
  }

  static create(name: string): CategoryName {
    return new CategoryName(name);
  }
}
