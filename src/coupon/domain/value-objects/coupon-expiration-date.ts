import { ValueObject } from '../../../common/domain/value-object';
import { InvalidCouponExpirationDateException } from '../exceptions/invalid-coupon-expiration-date.exception';

export class CouponExpirationDate implements ValueObject<CouponExpirationDate> {
  private readonly _expirationDate: Date;

  constructor(expirationDate: Date, startDate: Date) {
    const date = new Date(expirationDate);
    const dateStart = new Date(startDate);
    if (isNaN(date.getTime())) {
      throw new InvalidCouponExpirationDateException(`Expiration date ${expirationDate} is not valid`);
    }
    if (isNaN(dateStart.getTime())) {
      throw new InvalidCouponExpirationDateException(`Expiration date ${expirationDate} is not valid`);
    }
    if (date <= dateStart) {
      throw new InvalidCouponExpirationDateException(`Expiration date ${expirationDate} cannot be before or equal to the start date ${startDate}`);
    }
    this._expirationDate = expirationDate;
  }

  equals(obj: CouponExpirationDate): boolean {
    return this._expirationDate.getTime() === obj._expirationDate.getTime();
  }

  get ExpirationDate(): Date {
    return this._expirationDate;
  }

  static create(expirationDate: Date, startDate: Date): CouponExpirationDate {
    return new CouponExpirationDate(expirationDate, startDate);
  }
}
