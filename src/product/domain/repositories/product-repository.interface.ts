import { Result } from '../../../common/domain/result-handler/result';
import { Product } from '../product';

export interface IProductRepository {
  findProductById(id: string): Promise<Result<Product>>;
  findAllProducts(page: number, take: number): Promise<Result<Product[]>>;
  saveProductAggregate(product: Product): Promise<Result<Product>>;
}
