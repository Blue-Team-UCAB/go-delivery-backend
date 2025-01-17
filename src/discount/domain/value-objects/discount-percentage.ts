import { ValueObject } from '../../../common/domain/value-object';
import { InvalidDiscountPercentageException } from '../exceptions/invalid-discount-percentage.exception';

export class DiscountPercentage implements ValueObject<DiscountPercentage> {
  private readonly _percentage: number;

  constructor(percentage: number) {
    if (percentage < 0 || percentage > 100) {
      throw new InvalidDiscountPercentageException(`Percentage ${percentage} is not valid. It must be between 0 and 100.`);
    }
    this._percentage = percentage;
  }

  equals(obj: DiscountPercentage): boolean {
    return this._percentage === obj._percentage;
  }

  get Percentage(): number {
    return this._percentage;
  }

  static create(percentage: number): DiscountPercentage {
    return new DiscountPercentage(percentage);
  }
}
