import { ValueObject } from '../../../common/domain/value-object';
import { InvalidDiscountIdException } from '../exceptions/invalid-discount-id.exception';

export class DiscountId implements ValueObject<DiscountId> {
  private readonly _id: string;

  constructor(id: string) {
    const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
    if (!regex.test(id)) throw new InvalidDiscountIdException(`ID ${id} is not valid`);
    this._id = id;
  }

  equals(obj: DiscountId): boolean {
    return this._id === obj._id;
  }

  get Id(): string {
    return this._id;
  }

  static create(id: string): DiscountId {
    return new DiscountId(id);
  }
}
