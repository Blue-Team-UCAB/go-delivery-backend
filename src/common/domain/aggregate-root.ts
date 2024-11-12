import { DomainEvent } from './domain-event';
import { Entity } from './entity';
import { ValueObject } from './value-object';
import { SendMessage } from './send-message';

export abstract class AggregateRoot<T extends ValueObject<T>> extends Entity<T> {
  protected constructor(
    id: T,
    private readonly messagingService: SendMessage<DomainEvent>,
    event: DomainEvent,
  ) {
    super(id);
    this.apply(event);
  }

  protected async apply(event: DomainEvent): Promise<void> {
    this.when(event);
    this.checkValidState();
    await this.messagingService.sendMessage(event.getEventName, event);
  }

  protected abstract when(event: DomainEvent): void;

  protected abstract checkValidState(): void;
}
