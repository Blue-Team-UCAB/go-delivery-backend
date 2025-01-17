import { Result } from '../../../common/domain/result-handler/result';
import { Coupon } from '../coupon';

export interface ICouponCustomerRepository {
  saveCouponCustomerRelation(couponId: string, customerId: string, remainingUses: number): Promise<Result<{ id: string }>>;
  //validateCoupon(code: string, currentDate: Date, customerId: string): Promise<Result<Coupon>>;
}
