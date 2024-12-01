import { ValueObject } from 'src/common/domain/value-object';
import { InvalidProductCategoryNameException } from '../exceptions/invalid-product-category-name.exception';

export class ProductCategoryName implements ValueObject<ProductCategoryName> {
  private readonly _name: string;

  constructor(name: string) {
    if (name.length < 3) throw new InvalidProductCategoryNameException(`Category name ${name} is not valid`);
    this._name = name;
  }

  equals(obj: ProductCategoryName): boolean {
    return this._name === obj._name;
  }

  get Name(): string {
    return this._name;
  }

  static create(name: string): ProductCategoryName {
    return new ProductCategoryName(name);
  }
}
