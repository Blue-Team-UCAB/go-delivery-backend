import { IMapper } from '../../../common/application/mapper/mapper.interface';
import { CouponORMEntity } from '../models/orm-coupon.entity';
import { Coupon } from '../../domain/coupon';
import { CouponId } from '../../domain/value-objects/coupon.id';
import { CouponStartDate } from '../../domain/value-objects/coupon-start-date';
import { CouponExpirationDate } from '../../domain/value-objects/coupon-expiration-date';
import { CouponPorcentage } from '../../domain/value-objects/coupon-porcentage';
import { CouponCode } from '../../domain/value-objects/coupon-code';
import { CouponMessage } from '../../domain/value-objects/coupon-message';
import { CouponNumberUses } from '../../domain/value-objects/coupon-number-uses';
import { CouponCustomerORMEntity } from '../models/orm-coupon-costumer';
import { CouponCustomer } from '../../domain/entities/coupon-customer';
import { CustomerId } from '../../../customer/domain/value-objects/customer-id';
import { CouponCustomerRemainingUses } from '../../domain/value-objects/coupon-customer-remaining-uses';

export class CouponMapper implements IMapper<Coupon, CouponORMEntity> {
  async fromDomainToPersistence(domain: Coupon): Promise<CouponORMEntity> {
    const couponORM = new CouponORMEntity();
    couponORM.id = domain.Id.Id;
    couponORM.startDate = domain.StartDate.StartDate;
    couponORM.expirationDate = domain.ExpirationDate.ExpirationDate;
    couponORM.porcentage = domain.Porcentage.Porcentage;
    couponORM.code = domain.Code.Code;
    couponORM.title = domain.Message.Title;
    couponORM.message = domain.Message.Message;
    couponORM.numberUses = domain.NumberUses.NumberUses;
    couponORM.coupon_Customers = domain.Customers.map(customer => {
      const couponCustomerORM = new CouponCustomerORMEntity();
      couponCustomerORM.customer = { id_Costumer: customer.Id.Id } as any;
      couponCustomerORM.remainingUses = customer.RemainingUses.RemainingUses;
      return couponCustomerORM;
    });
    return couponORM;
  }

  async fromPersistenceToDomain(persistence: CouponORMEntity): Promise<Coupon> {
    const customers = persistence.coupon_Customers.map(couponCustomer => {
      return new CouponCustomer(CustomerId.create(couponCustomer.customer.id_Costumer), CouponCustomerRemainingUses.create(couponCustomer.remainingUses));
    });

    return new Coupon(
      CouponId.create(persistence.id),
      CouponStartDate.create(persistence.startDate),
      CouponExpirationDate.create(persistence.expirationDate, persistence.startDate),
      CouponPorcentage.create(persistence.porcentage),
      CouponCode.create(persistence.code),
      CouponMessage.create(persistence.title, persistence.message),
      CouponNumberUses.create(persistence.numberUses),
      customers,
    );
  }
}
