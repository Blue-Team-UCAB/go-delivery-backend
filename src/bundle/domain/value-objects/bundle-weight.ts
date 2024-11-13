import { ValueObject } from '../../../common/domain/value-object';
import { InvalidBundleWeightException } from '../exceptions/invalid-bundle-weight.exception';

export class BundleWeight implements ValueObject<BundleWeight> {
  private readonly _weight: number;

  constructor(weight: number) {
    if (weight < 0.01) throw new InvalidBundleWeightException(`Weight ${weight} is not valid`);
    this._weight = weight;
  }

  equals(obj: BundleWeight): boolean {
    return this._weight === obj._weight;
  }

  get Weight(): number {
    return this._weight;
  }

  static create(weight: number): BundleWeight {
    return new BundleWeight(weight);
  }
}
