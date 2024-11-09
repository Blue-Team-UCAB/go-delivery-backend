import { DomainEvent } from 'src/common/domain/domain-event';

export class ProductCreatedEvent extends DomainEvent {
  protected constructor(
    public id: string,
    public name: string,
  ) {
    super();
  }

  static create(id: string, name: string): ProductCreatedEvent {
    return new ProductCreatedEvent(id, name);
  }
}
