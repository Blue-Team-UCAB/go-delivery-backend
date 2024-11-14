import { ValueObject } from 'src/common/domain/value-object';
import { InvalidBundleIdException } from '../exceptions/invalid-bundle-id.exception';

export class BundleId implements ValueObject<BundleId> {
  private readonly _id: string;

  constructor(id: string) {
    const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
    if (!regex.test(id)) throw new InvalidBundleIdException(`ID ${id} is not valid`);
    this._id = id;
  }

  equals(obj: BundleId): boolean {
    return this._id === obj._id;
  }

  get Id(): string {
    return this._id;
  }

  static create(id: string): BundleId {
    return new BundleId(id);
  }
}