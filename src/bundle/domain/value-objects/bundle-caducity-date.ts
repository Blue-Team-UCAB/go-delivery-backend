import { ValueObject } from '../../../common/domain/value-object';
import { InvalidBundleCaducityDateException } from '../exceptions/invalid-bundle-caducity-date.exception';

export class BundleCaducityDate implements ValueObject<BundleCaducityDate> {
  private readonly _caducity_date: Date;

  constructor(caducity_date: Date) {
    const date = new Date(caducity_date);
    if (isNaN(date.getTime())) {
      throw new InvalidBundleCaducityDateException(`Caducity date ${caducity_date} is not valid`);
    }
    if (date < new Date(Date.now())) {
      throw new InvalidBundleCaducityDateException(`Caducity date ${caducity_date} cannot be in the past`);
    }
    this._caducity_date = date;
  }

  equals(obj: BundleCaducityDate): boolean {
    return this._caducity_date.getTime() === obj._caducity_date.getTime();
  }

  get CaducityDate(): Date {
    return this._caducity_date;
  }

  static create(caducity_date: Date): BundleCaducityDate {
    return new BundleCaducityDate(caducity_date);
  }
}
