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

  constructor(state: OrderStates) {
    if (!Object.values(OrderStates).includes(state)) {
      throw new InvalidOrderStateException(`State ${state} is not valid`);
    }
    this._state = state;
  }

  equals(obj: OrderState): boolean {
    return this._state === obj._state;
  }

  get State(): OrderStates {
    return this._state;
  }

  static create(state: OrderStates): OrderState {
    return new OrderState(state);
  }
}
