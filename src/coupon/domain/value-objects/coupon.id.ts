import { ValueObject } from '../../../common/domain/value-object';
import { InvalidCouponIdException } from '../exceptions/invalid-coupon-id.exception';

export class CouponId implements ValueObject<CouponId> {
  private readonly _id: string;

  constructor(id: string) {
    const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
    if (!regex.test(id)) throw new InvalidCouponIdException(`ID ${id} is not valid`);
    this._id = id;
  }

  equals(obj: CouponId): boolean {
    return this._id === obj._id;
  }

  get Id(): string {
    return this._id;
  }

  static create(id: string): CouponId {
    return new CouponId(id);
  }
}
