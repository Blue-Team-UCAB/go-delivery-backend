import { ValueObject } from '../../../common/domain/value-object';
import { InvalidOrderSubtotalAmountException } from '../exceptions/invalid-order-subtotal-amount.exception';

export class OrderSubtotalAmount implements ValueObject<OrderSubtotalAmount> {
  private readonly _amount: number;

  constructor(amount: number) {
    const amount2Decimal = Math.floor(amount * 100) / 100;
    if (amount2Decimal < 0) throw new InvalidOrderSubtotalAmountException(`Amount ${amount} is not valid`);
    this._amount = amount2Decimal;
  }

  equals(obj: OrderSubtotalAmount): boolean {
    return this._amount === obj._amount;
  }

  get Amount(): number {
    return this._amount;
  }

  static create(amount: number): OrderSubtotalAmount {
    return new OrderSubtotalAmount(amount);
  }
}
