import { ValueObject } from '../../../common/domain/value-object';
import { InvalidOrderStateException } from '../exceptions/invalid-order-state.exception';

export enum OrderStates {
  CREATED = 'CREATED',
  PROCESSED = 'PROCESSED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export class OrderState implements ValueObject<OrderState> {
  private readonly _state: OrderStates;
  private readonly _date: Date;

  constructor(state: OrderStates, date: Date) {
    if (!Object.values(OrderStates).includes(state)) {
      throw new InvalidOrderStateException(`State ${state} is not valid`);
    }
    if (isNaN(date.getTime())) {
      throw new InvalidOrderStateException(`Date ${date} is not valid`);
    }
    this._state = state;
    this._date = date;
  }

  equals(obj: OrderState): boolean {
    return this._state === obj._state && this._date.getTime() === obj._date.getTime();
  }

  get State(): OrderStates {
    return this._state;
  }

  get Date(): Date {
    return this._date;
  }

  static create(state: OrderStates, date: Date): OrderState {
    return new OrderState(state, date);
  }
}
