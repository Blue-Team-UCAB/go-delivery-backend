import { Result } from '../../../common/domain/result-handler/result';
import { Coupon } from '../coupon';

export interface ICouponCustomerRepository {
  saveCouponCustomerRelation(couponId: string, customerId: string, remainingUses: number): Promise<Result<void>>;
  //validateCoupon(code: string, currentDate: Date, customerId: string): Promise<Result<Coupon>>;
}
