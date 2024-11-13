import { ValueObject } from '../../../common/domain/value-object';
import { InvalidCaducityDateException } from '../exceptions/invalid-caducity-date.exception';

export class BundleCaducityDate implements ValueObject<BundleCaducityDate> {
  private readonly _caducity_date: Date;

  constructor(caducity_date: string) {
    const date = new Date(caducity_date);
    if (isNaN(date.getTime())) {
      throw new InvalidCaducityDateException(`Caducity date ${caducity_date} is not valid`);
    }
    if (date < new Date()) {
      throw new InvalidCaducityDateException(`Caducity date ${caducity_date} cannot be in the past`);
    }
    this._caducity_date = date;
  }

  equals(obj: BundleCaducityDate): boolean {
    return this._caducity_date.getTime() === obj._caducity_date.getTime();
  }

  get CaducityDate(): Date {
    return this._caducity_date;
  }

  static create(caducity_date: string): BundleCaducityDate {
    return new BundleCaducityDate(caducity_date);
  }
}
