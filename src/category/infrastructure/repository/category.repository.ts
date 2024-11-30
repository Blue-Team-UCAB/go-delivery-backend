import { Repository, DataSource } from 'typeorm';
import { CategoryORMEntity as CategoryORM } from '../models/orm-category.entity';
import { ICategoryRepository } from '../../domain/repositories/category-repository.interface';
import { CategoryMapper } from '../mappers/category.mapper';
import { Category } from 'src/category/domain/category';
import { Result } from 'src/common/domain/result-handler/result';

export class CategoryRepository extends Repository<CategoryORM> implements ICategoryRepository {
  private readonly categoryMapper: CategoryMapper;

  constructor(dataSource: DataSource) {
    super(CategoryORM, dataSource.createEntityManager());
    this.categoryMapper = new CategoryMapper();
  }

  async findAllCategories(page: number, perpage: number): Promise<Result<Category[]>> {
    try {
      const skip = perpage * page - perpage;

      const query = this.createQueryBuilder('category').select(['category.id_Category', 'category.name_Category', 'category.image_Category']).skip(skip).take(perpage);

      const categories = await query.getMany();
      const resp = await Promise.all(categories.map(category => this.categoryMapper.fromPersistenceToDomain(category)));
      return Result.success<Category[]>(resp, 200);
    } catch (e) {
      return Result.fail(null, 500, e.message);
    }
  }

  async saveCategoryAggregate(category: Category): Promise<Result<Category>> {
    try {
      const newCategory = await this.categoryMapper.fromDomainToPersistence(category);
      await this.save(newCategory);
      return Result.success<Category>(category, 200);
    } catch (error) {
      return Result.fail<Category>(new Error(error.message), error.code, error.message);
    }
  }
}
