import { Result } from 'src/common/Domain/result-handler/Result';
import { Product } from '../product';

export interface IProductRepository {
  findProductById(id: string): Promise<Result<Product>>;
  saveProductAggregate(product: Product): Promise<Result<Product>>;
}
