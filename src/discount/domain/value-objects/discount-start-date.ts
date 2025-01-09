import { ValueObject } from '../../../common/domain/value-object';
import { InvalidDiscountStartDateException } from '../exceptions/invalid-discount-start-date.exception';

export class DiscountStartDate implements ValueObject<DiscountStartDate> {
  private readonly _startDate: Date;

  constructor(startDate: Date) {
    const date = new Date(startDate);
    if (isNaN(date.getTime())) {
      throw new InvalidDiscountStartDateException(`Start date ${startDate} is not valid`);
    }
    this._startDate = startDate;
  }

  equals(obj: DiscountStartDate): boolean {
    return this._startDate.getTime() === obj._startDate.getTime();
  }

  get StartDate(): Date {
    return this._startDate;
  }

  static create(startDate: Date): DiscountStartDate {
    return new DiscountStartDate(startDate);
  }
}
