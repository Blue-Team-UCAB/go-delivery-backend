import { ValueObject } from 'src/common/domain/value-object';
import { InvalidProductDescriptionException } from '../exeptions/invalid-product-description.exeption';

export class ProductDescription implements ValueObject<ProductDescription> {
  private readonly _description: string;

  constructor(descriprion: string) {
    if (descriprion.length < 20) throw new InvalidProductDescriptionException(`Description ${descriprion} is not valid`);
    this._description = descriprion;
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
