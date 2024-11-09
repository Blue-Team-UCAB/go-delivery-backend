import { AggregateRoot } from 'src/common/domain/aggregate-root';
import { ProductId } from './value-objects/product.id';
import { ProductName } from './value-objects/product-name';
import { ProductDescription } from './value-objects/product-description';
import { ProductCreatedEvent } from './events/product-created.event';
import { InvalidProductException } from './exceptions/invalid-product.exception';
import { DomainEvent } from 'src/common/domain/domain-event';

export class Product extends AggregateRoot<ProductId> {
  private name: ProductName;
  private description: ProductDescription;

  get Name(): ProductName {
    return this.name;
  }

  get Description(): ProductDescription {
    return this.description;
  }

  constructor(id: ProductId, name: ProductName, description: ProductDescription) {
    const productCreated = ProductCreatedEvent.create(id, name, description);
    super(id, productCreated);
  }

  protected checkValidState(): void {
    if (!this.name || !this.description) throw new InvalidProductException(`Product not valid`);
  }

  protected when(event: DomainEvent): void {
    if (event instanceof ProductCreatedEvent) {
      this.name = event.name;
      this.description = event.description;
    }
  }
}
