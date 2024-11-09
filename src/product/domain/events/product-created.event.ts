import { DomainEvent } from 'src/common/domain/domain-event';
import { ProductId } from '../value-objects/product.id';
import { ProductName } from '../value-objects/product-name';
import { ProductDescription } from '../value-objects/product-description';

export class ProductCreatedEvent extends DomainEvent {
  protected constructor(
    public id: ProductId,
    public name: ProductName,
    public description: ProductDescription,
  ) {
    super();
  }

  static create(id: ProductId, name: ProductName, description: ProductDescription): ProductCreatedEvent {
    return new ProductCreatedEvent(id, name, description);
  }
}
