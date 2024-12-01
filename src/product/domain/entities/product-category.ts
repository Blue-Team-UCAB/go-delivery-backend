import { Entity } from '../../../common/domain/entity';
import { CategoryId } from '../../../category/domain/value-objects/category.id';
import { ProductCategoryName } from '../value-objects/product-category-name';

export class ProductCategory extends Entity<CategoryId> {
  constructor(
    id: CategoryId,
    private readonly name: ProductCategoryName,
  ) {
    super(id);
  }

  get Name(): ProductCategoryName {
    return this.name;
  }
}
