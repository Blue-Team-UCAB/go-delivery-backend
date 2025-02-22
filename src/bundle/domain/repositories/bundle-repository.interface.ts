import { Result } from '../../../common/domain/result-handler/result';
import { Bundle } from '../bundle';

export interface IBundleRepository {
  findBundleById(id: string): Promise<Result<Bundle>>;
  findAllBundles(page: number, perpage: number, category?: string[], name?: string, price?: string, popular?: string, discount?: string): Promise<Result<Bundle[]>>;
  saveBundleAggregate(product: Bundle): Promise<Result<Bundle>>;
}
