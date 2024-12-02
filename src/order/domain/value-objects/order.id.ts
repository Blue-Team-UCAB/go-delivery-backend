import { ValueObject } from '../../../common/domain/value-object';
import { InvalidOrderIdException } from '../exceptions/invalid-order-id.exception';

export class OrderId implements ValueObject<OrderId> {
  private readonly _id: string;

  constructor(id: string) {
    const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
    if (!regex.test(id)) throw new InvalidOrderIdException(`ID ${id} is not valid`);
    this._id = id;
  }

  equals(obj: OrderId): boolean {
    return this._id === obj._id;
  }

  get Id(): string {
    return this._id;
  }

  static create(id: string): OrderId {
    return new OrderId(id);
  }
}
