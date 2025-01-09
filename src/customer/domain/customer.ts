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
import { DirectionNotFound } from './exceptions/direction-not-found.exception';
import { DirectionName } from './value-objects/direction-name';
import { CustomerImage } from './value-objects/customer-image';

export class Customer extends AggregateRoot<CustomerId> {
  private name: CustomerName;
  private phone: CustomerPhone;
  private wallet: Wallet;
  private direction?: Direction[];
  private image?: CustomerImage;

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

  get Image(): CustomerImage {
    return this.image;
  }

  updateImage(image: CustomerImage): void {
    this.image = image;
  }

  sumWallet(amount: WalletAmount): void {
    this.wallet.addAmount(amount);
  }

  subtractWallet(amount: WalletAmount): void {
    this.wallet.subtractAmount(amount);
  }

  addDirection(id: DirectionId, direction: DirectionDescription, latitude: DirectionLatitude, longuitud: DirectionLonguitud, name_dir: DirectionName): void {
    const addDirection = DirectionAddedEvent.create(new Direction(id, direction, latitude, longuitud, name_dir));
    this.apply(addDirection);
  }

  modifyDirection(id: DirectionId, direction: DirectionDescription, latitude: DirectionLatitude, longuitud: DirectionLonguitud, name_dir: DirectionName): void {
    const dir = this.direction.find(dir => dir.Id.equals(id));
    if (!dir) {
      throw new DirectionNotFound('Direction not found');
    }
    dir.modify(direction, latitude, longuitud, name_dir);
  }

  deleteDirection(id: DirectionId): void {
    const dir = this.direction.find(dir => dir.Id.equals(id));
    if (!dir) {
      throw new DirectionNotFound('Direction not found');
    }
    this.direction = this.direction.filter(dir => !dir.Id.equals(id));
  }

  constructor(
    id: CustomerId,
    name: CustomerName,
    phone: CustomerPhone,
    idWallet: WalletId,
    amountWallet: WalletAmount,
    currencyWallet: WalletCurrency,
    direction?: Direction[],
    image?: CustomerImage,
  ) {
    const costumerCreated = CustomerCreatedEvent.create(id, name, phone, new Wallet(idWallet, amountWallet, currencyWallet), direction, image);
    super(id, costumerCreated);
  }

  protected when(event: DomainEvent): void {
    if (event instanceof CustomerCreatedEvent) {
      this.name = event.name;
      this.phone = event.phone;
      this.wallet = event.wallet;
      this.direction = event.direction;
      this.image = event.image;
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
