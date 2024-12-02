import { ValueObject } from '../../../common/domain/value-object';
import { InvalidOrderCreatedDateException } from '../exceptions/invalid-order-created-date.exception';

export class OrderCreatedDate implements ValueObject<OrderCreatedDate> {
  private readonly _createdDate: Date;

  constructor(createdDate: Date) {
    const date = new Date(createdDate);
    if (isNaN(date.getTime())) throw new InvalidOrderCreatedDateException(`Received date ${createdDate} is not valid`);
    this._createdDate = date;
  }

  equals(obj: OrderCreatedDate): boolean {
    return this._createdDate.getTime() === obj._createdDate.getTime();
  }

  get createdDate(): Date {
    return this._createdDate;
  }

  static create(createdDate: Date): OrderCreatedDate {
    return new OrderCreatedDate(createdDate);
  }
}
