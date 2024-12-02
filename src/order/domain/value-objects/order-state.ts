import { ValueObject } from '../../../common/domain/value-object';
import { InvalidOrderStateException } from '../exceptions/invalid-order-state.exception';

export class OrderState implements ValueObject<OrderState> {
  private readonly _state: string;
  private static readonly validStates = ['PENDING', 'IN PROCESS', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  constructor(state: string) {
    if (!OrderState.validStates.includes(state.toUpperCase())) throw new InvalidOrderStateException(`State ${state} is not valid`);
    this._state = state.toUpperCase();
  }

  equals(obj: OrderState): boolean {
    return this._state === obj._state;
  }

  get State(): string {
    return this._state;
  }

  static create(state: string): OrderState {
    return new OrderState(state);
  }
}
