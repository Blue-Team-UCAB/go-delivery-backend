import { DomainEvent } from './domain-event';
import { Entity } from './entity';
import { ValueObject } from './value-object';

export abstract class AggregateRoot<T extends ValueObject<T>> extends Entity<T> {
  protected constructor(
    id: T,
    private event: DomainEvent,
  ) {
    super(id);
    this.apply(event);
  }

  protected apply(event: DomainEvent): void {
    this.when(event);
    this.checkValidState();
    this.event = event;
  }

  protected abstract when(event: DomainEvent): void;

  protected abstract checkValidState(): void;

  public getDomainEvents(): DomainEvent {
    return this.event;
  }
}
