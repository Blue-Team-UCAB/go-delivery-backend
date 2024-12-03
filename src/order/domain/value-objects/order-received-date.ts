import { ValueObject } from '../../../common/domain/value-object';
import { InvalidOrderReceivedDateException } from '../exceptions/invalid-order-received-date.exception';

export class OrderReceivedDate implements ValueObject<OrderReceivedDate> {
  private readonly _receivedDate: Date;

  constructor(receivedDate: Date) {
    const date = new Date(receivedDate);
    if (isNaN(date.getTime())) throw new InvalidOrderReceivedDateException(`Received date ${receivedDate} is not valid`);
    this._receivedDate = date;
  }

  equals(obj: OrderReceivedDate): boolean {
    return this._receivedDate.getTime() === obj._receivedDate.getTime();
  }

  get ReceivedDate(): Date {
    return this._receivedDate;
  }

  static create(receivedDate: Date): OrderReceivedDate {
    return new OrderReceivedDate(receivedDate);
  }
}
