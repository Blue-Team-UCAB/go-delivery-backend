import { ValueObject } from '../../../common/domain/value-object';
import { InvalidCustomerPhoneException } from '../exceptions/invalid-customer-phone.exception';

export class CustomerPhone implements ValueObject<CustomerPhone> {
  private readonly _phone: string;

  constructor(phone: string) {
    if (phone.length < 3 || !this.validate(phone)) throw new InvalidCustomerPhoneException(`Phone ${phone} is not valid`);
    this._phone = phone;
  }

  equals(obj: CustomerPhone): boolean {
    return this._phone === obj._phone;
  }

  get Phone(): string {
    return this._phone;
  }

  validate(phone: string): Boolean {
    const regex = new RegExp(/^58[0-9]{10}$/);
    return regex.test(phone);
  }

  static create(phone: string): CustomerPhone {
    return new CustomerPhone(phone);
  }
}
