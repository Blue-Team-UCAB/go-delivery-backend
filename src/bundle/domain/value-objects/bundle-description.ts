import { ValueObject } from '../../../common/domain/value-object';
import { InvalidBundleDescriptionException } from '../exceptions/invalid-bundle-description.exception';

export class BundleDescription implements ValueObject<BundleDescription> {
  private readonly _description: string;

  constructor(description: string) {
    if (description.length < 20) throw new InvalidBundleDescriptionException(`Description ${description} is not valid`);
    this._description = description;
  }

  equals(obj: BundleDescription): boolean {
    return this._description === obj._description;
  }

  get Description(): string {
    return this._description;
  }

  static create(description: string): BundleDescription {
    return new BundleDescription(description);
  }
}
