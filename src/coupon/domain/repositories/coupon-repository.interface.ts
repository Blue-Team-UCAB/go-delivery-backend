import { Result } from '../../../common/domain/result-handler/result';
import { Coupon } from '../coupon';

export interface ICouponRepository {
  findCouponById(id: string): Promise<Result<Coupon>>;
  findCouponByCode(code: string): Promise<Result<Coupon>>;
  findAllCoupons(page: number, perpage: number, search?: string): Promise<Result<Coupon[]>>;
  saveCouponAggregate(coupon: Coupon): Promise<Result<Coupon>>;
  updateRemainingUses(couponId: string, customerId: string, remainingUses: number): Promise<Result<void>>;
  findApplicableCouponsByCustomer(customerId: string): Promise<Result<Coupon[]>>;
  //validateCoupon(code: string, currentDate: Date, customerId: string): Promise<Result<Coupon>>;
}
