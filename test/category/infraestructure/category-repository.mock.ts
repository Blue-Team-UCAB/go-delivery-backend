import { Category } from 'src/category/domain/category';
import { ICategoryRepository } from 'src/category/domain/repositories/category-repository.interface';
import { Result } from 'src/common/domain/result-handler/result';

export class CategoryRepositoryMock implements ICategoryRepository {
  private categories: Category[] = [];

  async findAllCategories(page: number, perpage: number): Promise<Result<Category[]>> {
    try {
      return Result.success(this.categories, 200);
    } catch (e) {
      return Result.fail<Category[]>(null, 500, e.message);
    }
  }

  async findCategoryById(id: string): Promise<Result<Category>> {
    try {
      const category = this.categories.find(category => category.Id.Id === id);
      return Result.success(category, 200);
    } catch (e) {
      return Result.fail<Category>(null, 500, e.message);
    }
  }
  async saveCategoryAggregate(category: Category): Promise<Result<Category>> {
    try {
      this.categories.push(category);
      return Result.success(category, 200);
    } catch (e) {
      return Result.fail<Category>(null, 500, e.message);
    }
  }
}
