import { DomainEvent } from '../../../common/domain/domain-event';
import { ProductId } from '../value-objects/product.id';
import { ProductName } from '../value-objects/product-name';
import { ProductDescription } from '../value-objects/product-description';
import { ProductImage } from '../value-objects/product-image';

export class ProductCreatedEvent extends DomainEvent {
  protected constructor(
    public id: ProductId,
    public name: ProductName,
    public description: ProductDescription,
    public imageUrl: ProductImage,
  ) {
    super();
  }

  static create(id: ProductId, name: ProductName, description: ProductDescription, imageUrl: ProductImage): ProductCreatedEvent {
    return new ProductCreatedEvent(id, name, description, imageUrl);
  }
}
