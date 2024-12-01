import { DomainEvent } from '../../../common/domain/domain-event';
import { CategoryImage } from '../value-objects/category-image';
import { CategoryName } from '../value-objects/category-name';
import { CategoryId } from '../value-objects/category.id';

export class CategoryCreatedEvent extends DomainEvent {
  protected constructor(
    public id: CategoryId,
    public name: CategoryName,
    public imageUrl: CategoryImage,
  ) {
    super();
  }

  static create(id: CategoryId, name: CategoryName, imageUrl: CategoryImage): CategoryCreatedEvent {
    return new CategoryCreatedEvent(id, name, imageUrl);
  }
}
