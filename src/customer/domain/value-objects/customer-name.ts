import { ValueObject } from '../../../common/domain/value-object';
import { InvalidCustomerNameException } from '../exceptions/invalid-customer-name.exception';

export class CustomerName implements ValueObject<CustomerName> {
  private readonly _name: string;

  constructor(name: string) {
    if (name.length < 3) throw new InvalidCustomerNameException(`Name ${name} is not valid`);
    this._name = name;
  }

  equals(obj: CustomerName): boolean {
    return this._name === obj._name;
  }

  get Name(): string {
    return this._name;
  }

  static create(name: string): CustomerName {
    return new CustomerName(name);
  }
}
