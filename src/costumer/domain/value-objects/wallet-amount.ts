import { ValueObject } from 'src/common/domain/value-object';
import { InvalidWalletAmountException } from '../exceptions/invalid-wallet-amount.exception';

export class WalletAmount implements ValueObject<WalletAmount> {
  private readonly _amount: number;

  constructor(amount: number) {
    const amount2Decimal = Math.floor(amount * 100) / 100;
    if (amount2Decimal < 0) throw new InvalidWalletAmountException(`Amount ${amount} is not valid`);
    this._amount = amount2Decimal;
  }

  equals(obj: WalletAmount): boolean {
    return this._amount === obj._amount;
  }

  get Amount(): number {
    return this._amount;
  }

  static create(amount: number): WalletAmount {
    return new WalletAmount(amount);
  }
}
