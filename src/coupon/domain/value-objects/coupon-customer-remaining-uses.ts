import { ValueObject } from '../../../common/domain/value-object';
import { InvalidCouponCustomerRemainingUsesException } from '../exceptions/invalid-coupon-customer-remaining-uses.exception';

export class CouponCustomerRemainingUses implements ValueObject<CouponCustomerRemainingUses> {
  private readonly _reaminingUses: number;

  constructor(remainingUses: number) {
    if (remainingUses < 0) {
      throw new InvalidCouponCustomerRemainingUsesException(`Remaining uses ${remainingUses} is not valid`);
    }
    this._reaminingUses = remainingUses;
  }

  equals(obj: CouponCustomerRemainingUses): boolean {
    return this._reaminingUses === obj._reaminingUses;
  }

  get RemainingUses(): number {
    return this._reaminingUses;
  }

  static create(remainingUses: number): CouponCustomerRemainingUses {
    return new CouponCustomerRemainingUses(remainingUses);
  }
}
