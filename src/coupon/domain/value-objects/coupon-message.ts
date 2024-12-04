import { ValueObject } from '../../../common/domain/value-object';
import { InvalidCouponMessageException } from '../exceptions/invalid-coupon-message.exception';

export class CouponMessage implements ValueObject<CouponMessage> {
  private readonly _title: string;
  private readonly _message: string;

  constructor(title: string, message: string) {
    if (!this.isValidTitle(title)) {
      throw new InvalidCouponMessageException(`Title "${title}" is not valid. It must be between 1 and 50 characters.`);
    }
    if (!this.isValidMessage(message)) {
      throw new InvalidCouponMessageException(`Message "${message}" is not valid. It must be between 1 and 200 characters.`);
    }
    this._title = title;
    this._message = message;
  }

  equals(obj: CouponMessage): boolean {
    return this._title === obj._title && this._message === obj._message;
  }

  get Title(): string {
    return this._title;
  }

  get Message(): string {
    return this._message;
  }

  private isValidTitle(title: string): boolean {
    return title.length > 0 && title.length <= 50;
  }

  private isValidMessage(message: string): boolean {
    return message.length > 0 && message.length <= 200;
  }

  static create(title: string, message: string): CouponMessage {
    return new CouponMessage(title, message);
  }
}
