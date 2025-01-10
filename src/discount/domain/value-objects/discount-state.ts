import { ValueObject } from '../../../common/domain/value-object';
import { InvalidDiscountStateException } from '../exceptions/invalid-discount-state.exception';

export enum DiscountStates {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class DiscountState implements ValueObject<DiscountState> {
  private readonly _state: DiscountStates;

  constructor(state: DiscountStates) {
    if (!Object.values(DiscountStates).includes(state)) {
      throw new InvalidDiscountStateException(`State ${state} is not valid`);
    }
    this._state = state;
  }

  equals(obj: DiscountState): boolean {
    return this._state === obj._state;
  }

  get State(): DiscountStates {
    return this._state;
  }

  static create(state: DiscountStates): DiscountState {
    return new DiscountState(state);
  }
}
