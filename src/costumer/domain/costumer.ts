import { AggregateRoot } from 'src/common/domain/aggregate-root';
import { CostumerId } from './value-objects/costumer-id';
import { CostumerName } from './value-objects/costumer-name';
import { CostumerPhone } from './value-objects/costumer-phone';
import { CostumerCreatedEvent } from './events/costumer-created.event';
import { InvalidCostumerException } from './exceptions/invalid-costumer.exception';
import { DomainEvent } from 'src/common/domain/domain-event';

export class Costumer extends AggregateRoot<CostumerId> {
  private name: CostumerName;
  private phone: CostumerPhone;

  get Name(): CostumerName {
    return this.name;
  }

  get Phone(): CostumerPhone {
    return this.phone;
  }

  constructor(id: CostumerId, name: CostumerName, phone: CostumerPhone) {
    const costumerCreated = CostumerCreatedEvent.create(id, name, phone);
    super(id, costumerCreated);
  }

  protected when(event: DomainEvent): void {
    if (event instanceof CostumerCreatedEvent) {
      this.name = event.name;
      this.phone = event.phone;
    }
  }

  protected checkValidState(): void {
    if (!this.name || !this.phone) {
      throw new InvalidCostumerException('The costumer is invalid');
    }
  }
}
