import { Result } from '../../../common/domain/result-handler/result';
import { Category } from '../category';

export interface ICategoryRepository {
  findAllCategories(page: number, perpage: number): Promise<Result<Category[]>>;
  findCategoryById(id: string): Promise<Result<Category>>;
  saveCategoryAggregate(category: Category): Promise<Result<Category>>;
}
