import { ValueObject } from '../../../common/domain/value-object';
import { InvalidCouponPorcentageException } from '../exceptions/invalid-coupon-porcentage.exception';

export class CouponPorcentage implements ValueObject<CouponPorcentage> {
  private readonly _porcentage: number;

  constructor(porcentage: number) {
    if (porcentage < 0 || porcentage > 100) {
      throw new InvalidCouponPorcentageException(`Porcentage ${porcentage} is not valid. It must be between 0 and 100.`);
    }
    this._porcentage = porcentage;
  }

  equals(obj: CouponPorcentage): boolean {
    return this._porcentage === obj._porcentage;
  }

  get Porcentage(): number {
    return this._porcentage;
  }

  static create(porcentage: number): CouponPorcentage {
    return new CouponPorcentage(porcentage);
  }
}
