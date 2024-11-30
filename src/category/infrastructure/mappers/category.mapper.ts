import { Category } from '../../domain/category';
import { IMapper } from '../../../common/application/mapper/mapper.interface';
import { CategoryORMEntity } from '../models/orm-category.entity';
import { CategoryId } from '../../domain/value-objects/category.id';
import { CategoryName } from '../../domain/value-objects/category-name';
import { CategoryImage } from '../../domain/value-objects/category-image';

export class CategoryMapper implements IMapper<Category, CategoryORMEntity> {
  async fromDomainToPersistence(domain: Category): Promise<CategoryORMEntity> {
    const categoryORM = new CategoryORMEntity();
    categoryORM.id_Category = domain.Id.Id;
    categoryORM.name_Category = domain.Name.Name;
    categoryORM.image_Category = domain.ImageUrl.Url;
    return categoryORM;
  }

  async fromPersistenceToDomain(persistence: CategoryORMEntity): Promise<Category> {
    return new Category(CategoryId.create(persistence.id_Category), CategoryName.create(persistence.name_Category), CategoryImage.create(persistence.image_Category));
  }
}
