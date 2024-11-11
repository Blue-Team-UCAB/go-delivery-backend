import { ValueObject } from 'src/common/domain/value-object';
import { InvalidProductCategoryException } from '../exceptions/invalid-product-category.exception';

export class ProductCategory implements ValueObject<ProductCategory> {
  private readonly _category: string;

  constructor(category: string) {
    if (category.length < 3) throw new InvalidProductCategoryException(`Category ${category} is not valid`);
    this._category = category;
  }

  equals(obj: ProductCategory): boolean {
    return this._category === obj._category;
  }

  get Category(): string {
    return this._category;
  }

  static create(category: string): ProductCategory {
    return new ProductCategory(category);
  }
}
