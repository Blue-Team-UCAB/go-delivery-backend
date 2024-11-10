import { ValueObject } from 'src/common/domain/value-object';
import { InvalidProductWeightException } from '../exceptions/invalid-product-weight.exception';

export class ProductWeight implements ValueObject<ProductWeight> {
  private readonly _weight: number;

  constructor(weight: number) {
    if (weight < 0.01) throw new InvalidProductWeightException(`Weight ${weight} is not valid`);
    this._weight = weight;
  }

  equals(obj: ProductWeight): boolean {
    return this._weight === obj._weight;
  }

  get Weight(): number {
    return this._weight;
  }

  static create(weight: number): ProductWeight {
    return new ProductWeight(weight);
  }
}
