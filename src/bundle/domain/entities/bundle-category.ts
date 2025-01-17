import { Entity } from '../../../common/domain/entity';
import { CategoryId } from '../../../category/domain/value-objects/category.id';
import { BundleCategoryName } from '../value-objects/bundle-category-name';

export class BundleCategory extends Entity<CategoryId> {
  constructor(
    id: CategoryId,
    private readonly name: BundleCategoryName,
  ) {
    super(id);
  }

  get Name(): BundleCategoryName {
    return this.name;
  }
}
