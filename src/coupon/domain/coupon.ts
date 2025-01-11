import { DomainEvent } from 'src/common/domain/domain-event';
import { AggregateRoot } from '../../common/domain/aggregate-root';
import { CouponCreatedEvent } from './events/coupon-created.event';
import { CouponCode } from './value-objects/coupon-code';
import { CouponExpirationDate } from './value-objects/coupon-expiration-date';
import { CouponMessage } from './value-objects/coupon-message';
import { CouponNumberUses } from './value-objects/coupon-number-uses';
import { CouponPorcentage } from './value-objects/coupon-porcentage';
import { CouponStartDate } from './value-objects/coupon-start-date';
import { CouponId } from './value-objects/coupon.id';
import { InvalidCouponException } from './exceptions/invalid-coupon.exception';
import { CouponCustomer } from './entities/coupon-customer';
import { CustomerId } from '../../customer/domain/value-objects/customer-id';

export class Coupon extends AggregateRoot<CouponId> {
  private startingDate: CouponStartDate;
  private expirationDate: CouponExpirationDate;
  private porcentage: CouponPorcentage;
  private code: CouponCode;
  private message: CouponMessage;
  private numberUses: CouponNumberUses;
  private customers: CouponCustomer[];

  get StartDate(): CouponStartDate {
    return this.startingDate;
  }

  get ExpirationDate(): CouponExpirationDate {
    return this.expirationDate;
  }

  get Porcentage(): CouponPorcentage {
    return this.porcentage;
  }

  get Code(): CouponCode {
    return this.code;
  }

  get Message(): CouponMessage {
    return this.message;
  }

  get NumberUses(): CouponNumberUses {
    return this.numberUses;
  }

  get Customers(): CouponCustomer[] {
    return this.customers;
  }

  constructor(
    id: CouponId,
    startDate: CouponStartDate,
    expirationDate: CouponExpirationDate,
    porcentage: CouponPorcentage,
    code: CouponCode,
    message: CouponMessage,
    numberUses: CouponNumberUses,
    customers: CouponCustomer[],
  ) {
    const couponCreated = CouponCreatedEvent.create(id, startDate, expirationDate, porcentage, code, message, numberUses, customers);
    super(id, couponCreated);
  }

  protected checkValidState(): void {
    if (!this.startingDate || !this.expirationDate || !this.porcentage || !this.code || !this.message || !this.numberUses) {
      throw new InvalidCouponException('Coupon not valid');
    }
  }

  protected when(event: DomainEvent): void {
    if (event instanceof CouponCreatedEvent) {
      this.startingDate = event.startDate;
      this.expirationDate = event.expirationDate;
      this.porcentage = event.porcentage;
      this.code = event.code;
      this.message = event.message;
      this.numberUses = event.numberUses;
      this.customers = event.customers;
    }
  }

  // validateCouponApplied(customer: CustomerId): boolean {
  //   const couponCustomer = this.Customers.find(c => c.Id.equals(customer));
  //   if (couponCustomer === undefined || couponCustomer.RemainingUses.RemainingUses <= 0) {
  //     return false;
  //   }
  //   return true;
  // }

  validateCouponClaimed(currentDate: Date, customer: CustomerId): boolean {
    const couponCustomer = this.Customers.find(c => c.Id.equals(customer));
    if (couponCustomer) {
      return false;
    }
    const expirationDate = new Date(this.ExpirationDate.ExpirationDate);
    const currentDateFormatted = new Date(currentDate);
    if (currentDateFormatted > expirationDate) {
      return false;
    }
    return true;
  }

  applyCoupon(customer: CustomerId): void {
    const couponCustomer = this.Customers.find(c => c.Id.equals(customer));
    if (couponCustomer === undefined) {
      return;
    }
    couponCustomer.subtractUse();
  }
}
