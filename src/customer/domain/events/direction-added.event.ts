import { DomainEvent } from 'src/common/domain/domain-event';
import { Direction } from '../entities/direction';

export const Customer_CREATED_EVENT = 'DirectionAddedEvent';

export class DirectionAddedEvent extends DomainEvent {
  protected constructor(public direction: Direction) {
    super();
  }

  static create(direction: Direction): DirectionAddedEvent {
    return new DirectionAddedEvent(direction);
  }
}
