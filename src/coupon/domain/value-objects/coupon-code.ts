import { ValueObject } from '../../../common/domain/value-object';
import { InvalidCouponCodeException } from '../exceptions/invalid-coupon-code.exception';

export class CouponCode implements ValueObject<CouponCode> {
  private readonly _code: string;

  constructor(code: string) {
    if (!this.isValidCode(code)) {
      throw new InvalidCouponCodeException(`Coupon code ${code} is not valid`);
    }
    this._code = code;
  }

  equals(obj: CouponCode): boolean {
    return this._code === obj._code;
  }

  get Code(): string {
    return this._code;
  }

  private isValidCode(code: string): boolean {
    const regex = new RegExp('^[A-Z0-9]+$');
    return regex.test(code);
  }

  static create(code: string): CouponCode {
    return new CouponCode(code);
  }
}
