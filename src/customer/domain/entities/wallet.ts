import { Entity } from 'src/common/domain/entity';
import { WalletId } from '../value-objects/wallet-id';
import { WalletAmount } from '../value-objects/wallet-amount';
import { WalletCurrency } from '../value-objects/wallet-currency';

export class Wallet extends Entity<WalletId> {
  constructor(
    id: WalletId,
    private amount: WalletAmount,
    private currency: WalletCurrency,
  ) {
    super(id);
  }

  get Amount(): WalletAmount {
    return this.amount;
  }

  get Currency(): WalletCurrency {
    return this.currency;
  }

  addAmount(amount: number): void {
    this.amount = WalletAmount.create(this.amount.Amount + amount);
  }

  subtractAmount(amount: number): void {
    this.amount = WalletAmount.create(this.amount.Amount - amount);
  }
}
