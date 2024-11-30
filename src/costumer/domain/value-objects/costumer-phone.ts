import { ValueObject } from '../../../common/domain/value-object';
import { InvalidCostumerPhoneException } from '../exceptions/invalid-costumer-phone.exception';

export class CostumerPhone implements ValueObject<CostumerPhone> {
  private readonly _phone: string;

  constructor(phone: string) {
    if (phone.length < 3 || !this.validate(phone)) throw new InvalidCostumerPhoneException(`Phone ${phone} is not valid`);
    this._phone = phone;
  }

  equals(obj: CostumerPhone): boolean {
    return this._phone === obj._phone;
  }

  get Phone(): string {
    return this._phone;
  }

  validate(phone: string): Boolean {
    const regex = new RegExp(/^58[0-9]{10}$/);
    return regex.test(phone);
  }

  static create(phone: string): CostumerPhone {
    return new CostumerPhone(phone);
  }
}
