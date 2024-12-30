import { DomainEvent } from 'src/common/domain/domain-event';
import { CustomerId } from '../value-objects/customer-id';
import { CustomerName } from '../value-objects/customer-name';
import { CustomerPhone } from '../value-objects/customer-phone';
import { Wallet } from '../entities/wallet';
import { Direction } from '../entities/direction';

export const Customer_CREATED_EVENT = 'CustomerCreatedEvent';

export class CustomerCreatedEvent extends DomainEvent {
  protected constructor(
    public id: CustomerId,
    public name: CustomerName,
    public phone: CustomerPhone,
    public wallet: Wallet,
    public direction?: Direction[],
  ) {
    super();
  }

  static create(id: CustomerId, name: CustomerName, phone: CustomerPhone, wallet: Wallet, direction?: Direction[]): CustomerCreatedEvent {
    return new CustomerCreatedEvent(id, name, phone, wallet, direction);
  }
}
