import { ValueObject } from '../../../common/domain/value-object';
import { InvalidProductDescriptionException } from '../exceptions/invalid-product-description.exception';

export class ProductDescription implements ValueObject<ProductDescription> {
  private readonly _description: string;

  constructor(description: string) {
    if (description.length < 20) throw new InvalidProductDescriptionException(`Description ${description} is not valid`);
    this._description = description;
  }

  equals(obj: ProductDescription): boolean {
    return this._description === obj._description;
  }

  get Description(): string {
    return this._description;
  }

  static create(description: string): ProductDescription {
    return new ProductDescription(description);
  }
}
