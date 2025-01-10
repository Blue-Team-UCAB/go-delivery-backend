import { Result } from '../../../common/domain/result-handler/result';
import { Product } from '../product';

export interface IProductRepository {
  findProductById(id: string): Promise<Result<Product>>;
  findAllProducts(page: number, perpage: number, category?: string, name?: string, price?: string, popular?: string, discount?: string): Promise<Result<Product[]>>;
  saveProductAggregate(product: Product): Promise<Result<Product>>;
}
