import { AggregateRoot } from '../../common/domain/aggregate-root';
import { CategoryCreatedEvent } from './events/category-created.event';
import { InvalidCategoryException } from './exceptions/invalid-category.exception';
import { CategoryImage } from './value-objects/category-image';
import { CategoryName } from './value-objects/category-name';
import { CategoryId } from './value-objects/category.id';
import { DomainEvent } from '../../common/domain/domain-event';

export class Category extends AggregateRoot<CategoryId> {
  private name: CategoryName;
  private imageUrl: CategoryImage;

  get Name(): CategoryName {
    return this.name;
  }

  get ImageUrl(): CategoryImage {
    return this.imageUrl;
  }

  constructor(id: CategoryId, name: CategoryName, imageUrl: CategoryImage) {
    const categoryCreated = CategoryCreatedEvent.create(id, name, imageUrl);
    super(id, categoryCreated);
  }

  protected checkValidState(): void {
    if (!this.name || !this.imageUrl) throw new InvalidCategoryException(`Category not valid`);
  }

  protected when(event: DomainEvent): void {
    if (event instanceof CategoryCreatedEvent) {
      this.name = event.name;
      this.imageUrl = event.imageUrl;
    }
  }
}
