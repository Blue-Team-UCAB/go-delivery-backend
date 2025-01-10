import { Result } from 'src/common/domain/result-handler/result';
import { Discount } from '../discount';
import { Product } from '../../../product/domain/product';
import { Bundle } from '../../../bundle/domain/bundle';

export interface IDiscountRepository {
  saveDiscountAggregate(discount: Discount): Promise<Result<Discount>>;
  findDiscountByProduct(product: Product, currentDate: Date): Promise<Result<Discount[]>>;
  findDiscountByBundle(bundle: Bundle, currentDate: Date): Promise<Result<Discount[]>>;
}
