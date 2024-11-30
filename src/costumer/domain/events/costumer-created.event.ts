import { DomainEvent } from 'src/common/domain/domain-event';
import { CostumerId } from '../value-objects/costumer-id';
import { CostumerName } from '../value-objects/costumer-name';
import { CostumerPhone } from '../value-objects/costumer-phone';

export const COSTUMER_CREATED_EVENT = 'CostumerCreatedEvent';

export class CostumerCreatedEvent extends DomainEvent {
  protected constructor(
    public id: CostumerId,
    public name: CostumerName,
    public phone: CostumerPhone,
  ) {
    super();
  }

  static create(id: CostumerId, name: CostumerName, phone: CostumerPhone): CostumerCreatedEvent {
    return new CostumerCreatedEvent(id, name, phone);
  }
}
