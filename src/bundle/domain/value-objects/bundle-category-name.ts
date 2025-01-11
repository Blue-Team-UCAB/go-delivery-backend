import { ValueObject } from 'src/common/domain/value-object';
import { InvalidBundleCategoryNameException } from '../exceptions/invalid-bundle-category-name.exception';

export class BundleCategoryName implements ValueObject<BundleCategoryName> {
  private readonly _name: string;

  constructor(name: string) {
    if (name.length < 3) throw new InvalidBundleCategoryNameException(`Category name ${name} is not valid`);
    this._name = name;
  }

  equals(obj: BundleCategoryName): boolean {
    return this._name === obj._name;
  }

  get Name(): string {
    return this._name;
  }

  static create(name: string): BundleCategoryName {
    return new BundleCategoryName(name);
  }
}
