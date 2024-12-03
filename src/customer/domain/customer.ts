import { AggregateRoot } from 'src/common/domain/aggregate-root';
import { CustomerId } from './value-objects/customer-id';
import { CustomerName } from './value-objects/customer-name';
import { CustomerPhone } from './value-objects/customer-phone';
import { CustomerCreatedEvent } from './events/customer-created.event';
import { InvalidCustomerException } from './exceptions/invalid-customer.exception';
import { DomainEvent } from 'src/common/domain/domain-event';
import { Wallet } from './entities/wallet';
import { WalletId } from './value-objects/wallet-id';
import { WalletAmount } from './value-objects/wallet-amount';
import { WalletCurrency } from './value-objects/wallet-currency';

export class Customer extends AggregateRoot<CustomerId> {
  private name: CustomerName;
  private phone: CustomerPhone;
  private wallet: Wallet;

  get Name(): CustomerName {
    return this.name;
  }

  get Phone(): CustomerPhone {
    return this.phone;
  }

  get Wallet(): Wallet {
    return this.wallet;
  }

  sumWallet(amount: WalletAmount): void {
    this.wallet.addAmount(amount);
  }

  subtractWallet(amount: WalletAmount): void {
    this.wallet.subtractAmount(amount);
  }

  constructor(id: CustomerId, name: CustomerName, phone: CustomerPhone, idWallet: WalletId, amountWallet: WalletAmount, currencyWallet: WalletCurrency) {
    const costumerCreated = CustomerCreatedEvent.create(id, name, phone, new Wallet(idWallet, amountWallet, currencyWallet));
    super(id, costumerCreated);
  }

  protected when(event: DomainEvent): void {
    if (event instanceof CustomerCreatedEvent) {
      this.name = event.name;
      this.phone = event.phone;
      this.wallet = event.wallet;
    }
  }

  protected checkValidState(): void {
    if (!this.name || !this.phone) {
      throw new InvalidCustomerException('The Customer is invalid');
    }
  }
}
