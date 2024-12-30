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
import { Direction } from './entities/direction';
import { DirectionId } from './value-objects/direction-id';
import { DirectionDescription } from './value-objects/direction-direction';
import { DirectionLatitude } from './value-objects/direction-latitude';
import { DirectionLonguitud } from './value-objects/direction-longuitude';
import { DirectionAddedEvent } from './events/direction-added.event';

export class Customer extends AggregateRoot<CustomerId> {
  private name: CustomerName;
  private phone: CustomerPhone;
  private wallet: Wallet;
  private direction: Direction[] = [];

  get Name(): CustomerName {
    return this.name;
  }

  get Phone(): CustomerPhone {
    return this.phone;
  }

  get Wallet(): Wallet {
    return this.wallet;
  }

  get Direction(): Direction[] {
    return this.direction;
  }

  sumWallet(amount: WalletAmount): void {
    this.wallet.addAmount(amount);
  }

  subtractWallet(amount: WalletAmount): void {
    this.wallet.subtractAmount(amount);
  }

  addDirection(id: DirectionId, direction: DirectionDescription, latitude: DirectionLatitude, longuitud: DirectionLonguitud): void {
    const addDirection = DirectionAddedEvent.create(new Direction(id, direction, latitude, longuitud));
    this.apply(addDirection);
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
    if (event instanceof DirectionAddedEvent) {
      this.direction.push(event.direction);
    }
  }

  protected checkValidState(): void {
    if (!this.name || !this.phone) {
      throw new InvalidCustomerException('The Customer is invalid');
    }
  }
}
