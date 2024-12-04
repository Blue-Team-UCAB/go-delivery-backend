import { DomainEvent } from '../../../common/domain/domain-event';
import { CouponCode } from '../value-objects/coupon-code';
import { CouponExpirationDate } from '../value-objects/coupon-expiration-date';
import { CouponMessage } from '../value-objects/coupon-message';
import { CouponNumberUses } from '../value-objects/coupon-number-uses';
import { CouponPorcentage } from '../value-objects/coupon-porcentage';
import { CouponStartDate } from '../value-objects/coupon-start-date';
import { CouponId } from '../value-objects/coupon.id';

export class CouponCreatedEvent extends DomainEvent {
  protected constructor(
    public id: CouponId,
    public startDate: CouponStartDate,
    public expirationDate: CouponExpirationDate,
    public porcentage: CouponPorcentage,
    public code: CouponCode,
    public message: CouponMessage,
    public numberUses: CouponNumberUses,
  ) {
    super();
  }

  static create(
    id: CouponId,
    startDate: CouponStartDate,
    expirationDate: CouponExpirationDate,
    porcentage: CouponPorcentage,
    code: CouponCode,
    message: CouponMessage,
    numberUses: CouponNumberUses,
  ): CouponCreatedEvent {
    return new CouponCreatedEvent(id, startDate, expirationDate, porcentage, code, message, numberUses);
  }
}
