import { Result } from '../../../common/domain/result-handler/result';
import { Bundle } from '../bundle';

export interface IBundleRepository {
  findBundleById(id: string): Promise<Result<Bundle>>;
  findAllBundles(page: number, take: number): Promise<Result<Bundle[]>>;
  saveBundleAggregate(product: Bundle): Promise<Result<Bundle>>;
}
