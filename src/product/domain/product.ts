import { AggregateRoot } from '../../common/domain/aggregate-root';
import { ProductId } from './value-objects/product.id';
import { ProductName } from './value-objects/product-name';
import { ProductDescription } from './value-objects/product-description';
import { ProductCreatedEvent } from './events/product-created.event';
import { InvalidProductException } from './exceptions/invalid-product.exception';
import { DomainEvent } from '../../common/domain/domain-event';
import { ProductImage } from './value-objects/product-image';

export class Product extends AggregateRoot<ProductId> {
  private name: ProductName;
  private description: ProductDescription;
  private imageUrl: ProductImage;

  get Name(): ProductName {
    return this.name;
  }

  get Description(): ProductDescription {
    return this.description;
  }

  get ImageUrl(): ProductImage {
    return this.imageUrl;
  }

  constructor(id: ProductId, name: ProductName, description: ProductDescription, imageUrl: ProductImage) {
    const productCreated = ProductCreatedEvent.create(id, name, description, imageUrl);
    super(id, productCreated);
  }

  protected checkValidState(): void {
    if (!this.name || !this.description) throw new InvalidProductException(`Product not valid`);
  }

  protected when(event: DomainEvent): void {
    if (event instanceof ProductCreatedEvent) {
      this.name = event.name;
      this.description = event.description;
      this.imageUrl = event.imageUrl;
    }
  }
}
