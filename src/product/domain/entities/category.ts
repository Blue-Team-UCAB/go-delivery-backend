import { Entity } from 'src/common/domain/entity';
import { CategoryId } from '../value-objects/category.id';
import { CategoryName } from '../value-objects/category-name';

export class Category extends Entity<CategoryId> {
  private name: CategoryName;
}
