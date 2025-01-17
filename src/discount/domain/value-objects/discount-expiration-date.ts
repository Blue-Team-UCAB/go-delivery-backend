import { ValueObject } from '../../../common/domain/value-object';
import { InvalidDiscountExpirationDateException } from '../exceptions/invalid-discount-expiration-date.exception';

export class DiscountExpirationDate implements ValueObject<DiscountExpirationDate> {
  private readonly _expirationDate: Date;

  constructor(expirationDate: Date, startDate: Date) {
    const date = new Date(expirationDate);
    const dateStart = new Date(startDate);
    if (isNaN(date.getTime())) {
      throw new InvalidDiscountExpirationDateException(`Expiration date ${expirationDate} is not valid`);
    }
    if (isNaN(dateStart.getTime())) {
      throw new InvalidDiscountExpirationDateException(`Expiration date ${expirationDate} is not valid`);
    }
    if (date <= dateStart) {
      throw new InvalidDiscountExpirationDateException(`Expiration date ${expirationDate} cannot be before or equal to the start date ${startDate}`);
    }
    this._expirationDate = expirationDate;
  }

  equals(obj: DiscountExpirationDate): boolean {
    return this._expirationDate.getTime() === obj._expirationDate.getTime();
  }

  get ExpirationDate(): Date {
    return this._expirationDate;
  }

  static create(expirationDate: Date, startDate: Date): DiscountExpirationDate {
    return new DiscountExpirationDate(expirationDate, startDate);
  }
}
