import { ValueObject } from '../../../common/domain/value-object';
import { InvalidOrderCourierIdException } from '../exceptions/invalid-order-courier-id.exception';

export class OrderCourierId implements ValueObject<OrderCourierId> {
  private readonly _id: string;

  constructor(id: string) {
    const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
    if (!regex.test(id)) throw new InvalidOrderCourierIdException(`ID ${id} is not valid`);
    this._id = id;
  }

  equals(obj: OrderCourierId): boolean {
    return this._id === obj._id;
  }

  get Id(): string {
    return this._id;
  }

  static create(id: string): OrderCourierId {
    return new OrderCourierId(id);
  }
}
