import { AggregateRoot } from 'src/common/domain/aggregate-root';
import { CostumerId } from './value-objects/costumer-id';
import { CostumerName } from './value-objects/costumer-name';
import { CostumerPhone } from './value-objects/costumer-phone';
import { CostumerCreatedEvent } from './events/costumer-created.event';
import { InvalidCostumerException } from './exceptions/invalid-costumer.exception';
import { DomainEvent } from 'src/common/domain/domain-event';
import { Wallet } from './entities/wallet';
import { WalletId } from './value-objects/wallet-id';
import { WalletAmount } from './value-objects/wallet-amount';
import { WalletCurrency } from './value-objects/wallet-currency';

export class Costumer extends AggregateRoot<CostumerId> {
  private name: CostumerName;
  private phone: CostumerPhone;
  private wallet: Wallet;

  get Name(): CostumerName {
    return this.name;
  }

  get Phone(): CostumerPhone {
    return this.phone;
  }

  get Wallet(): Wallet {
    return this.wallet;
  }

  constructor(id: CostumerId, name: CostumerName, phone: CostumerPhone, idWallet: WalletId, amountWallet: WalletAmount, currencyWallet: WalletCurrency) {
    const costumerCreated = CostumerCreatedEvent.create(id, name, phone, new Wallet(idWallet, amountWallet, currencyWallet));
    super(id, costumerCreated);
  }

  protected when(event: DomainEvent): void {
    if (event instanceof CostumerCreatedEvent) {
      this.name = event.name;
      this.phone = event.phone;
      this.wallet = event.wallet;
    }
  }

  protected checkValidState(): void {
    if (!this.name || !this.phone) {
      throw new InvalidCostumerException('The costumer is invalid');
    }
  }
}
