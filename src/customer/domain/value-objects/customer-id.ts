import { ValueObject } from 'src/common/domain/value-object';
import { InvalidCustomerIdException } from '../exceptions/invalid-customer-id.exception';

export class CustomerId implements ValueObject<CustomerId> {
  private readonly _id: string;

  constructor(id: string) {
    const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
    if (!regex.test(id)) throw new InvalidCustomerIdException(`ID ${id} is not valid`);
    this._id = id;
  }

  equals(obj: CustomerId): boolean {
    return this._id === obj._id;
  }

  get Id(): string {
    return this._id;
  }

  static create(id: string): CustomerId {
    return new CustomerId(id);
  }
}
