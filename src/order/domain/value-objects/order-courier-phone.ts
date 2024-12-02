import { ValueObject } from '../../../common/domain/value-object';
import { InvalidOrderCourierPhoneException } from '../exceptions/invalid-order-courier-phone.exception';

export class OrderCourierPhone implements ValueObject<OrderCourierPhone> {
  private readonly _phone: string;

  constructor(phone: string) {
    if (phone.length < 3 || !this.validate(phone)) throw new InvalidOrderCourierPhoneException(`Phone ${phone} is not valid`);
    this._phone = phone;
  }

  equals(obj: OrderCourierPhone): boolean {
    return this._phone === obj._phone;
  }

  get Phone(): string {
    return this._phone;
  }

  validate(phone: string): Boolean {
    const regex = new RegExp(/^58[0-9]{10}$/);
    return regex.test(phone);
  }

  static create(phone: string): OrderCourierPhone {
    return new OrderCourierPhone(phone);
  }
}
