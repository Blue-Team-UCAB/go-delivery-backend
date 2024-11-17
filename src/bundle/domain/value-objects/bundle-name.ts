import { ValueObject } from '../../../common/domain/value-object';
import { InvalidBundleNameException } from '../exceptions/invalid-bundle-name.exception';

export class BundleName implements ValueObject<BundleName> {
  private readonly _name: string;

  constructor(name: string) {
    if (name.length < 3) throw new InvalidBundleNameException(`Name ${name} is not valid`);
    this._name = name;
  }

  equals(obj: BundleName): boolean {
    return this._name === obj._name;
  }

  get Name(): string {
    return this._name;
  }

  static create(name: string): BundleName {
    return new BundleName(name);
  }
}
