import { ValueObject } from '../../../common/domain/value-object';
import { InvalidCouponStartDateException } from '../exceptions/invalid-coupon-start-date.exception';

export class CouponStartDate implements ValueObject<CouponStartDate> {
  private readonly _startDate: Date;

  constructor(startDate: Date) {
    const date = new Date(startDate);
    if (isNaN(date.getTime())) {
      throw new InvalidCouponStartDateException(`Start date ${startDate} is not valid`);
    }
    if (date < new Date(Date.now())) {
      throw new InvalidCouponStartDateException(`Start date ${startDate} cannot be before the current date`);
    }
    this._startDate = startDate;
  }

  equals(obj: CouponStartDate): boolean {
    return this._startDate.getTime() === obj._startDate.getTime();
  }

  get StartDate(): Date {
    return this._startDate;
  }

  static create(startDate: Date): CouponStartDate {
    return new CouponStartDate(startDate);
  }
}
