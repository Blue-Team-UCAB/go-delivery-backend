import { ValueObject } from '../../../common/domain/value-object';
import { InvalidCouponNumberUsesException } from '../exceptions/invalid-coupon-number-uses.exception';

export class CouponNumberUses implements ValueObject<CouponNumberUses> {
  private readonly _uses: number;

  constructor(uses: number) {
    if (uses < 0) throw new InvalidCouponNumberUsesException(`Uses ${uses} is not valid`);
    this._uses = uses;
  }

  equals(obj: CouponNumberUses): boolean {
    return this._uses === obj._uses;
  }

  get NumberUses(): number {
    return this._uses;
  }

  static create(uses: number): CouponNumberUses {
    return new CouponNumberUses(uses);
  }
}
