import { ValueObject } from '../../../common/domain/value-object';
import { InvalidOrderTotalAmountException } from '../exceptions/invalid-order-total-amount.exception';

export class OrderTotalAmount implements ValueObject<OrderTotalAmount> {
  private readonly _amount: number;

  constructor(amount: number) {
    const amount2Decimal = Math.floor(amount * 100) / 100;
    if (amount2Decimal < 0) throw new InvalidOrderTotalAmountException(`Amount ${amount} is not valid`);
    this._amount = amount2Decimal;
  }

  equals(obj: OrderTotalAmount): boolean {
    return this._amount === obj._amount;
  }

  get Amount(): number {
    return this._amount;
  }

  static create(amount: number): OrderTotalAmount {
    return new OrderTotalAmount(amount);
  }
}
