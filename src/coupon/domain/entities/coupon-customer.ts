import { CustomerId } from '../../../customer/domain/value-objects/customer-id';
import { Entity } from '../../../common/domain/entity';
import { CouponCustomerRemainingUses } from '../value-objects/coupon-customer-remaining-uses';

export class CouponCustomer extends Entity<CustomerId> {
  constructor(
    id: CustomerId,
    private remainingUses: CouponCustomerRemainingUses,
  ) {
    super(id);
  }

  get RemainingUses(): CouponCustomerRemainingUses {
    return this.remainingUses;
  }

  subtractUse(): void {
    this.remainingUses = CouponCustomerRemainingUses.create(this.remainingUses.RemainingUses - 1);
  }
}
