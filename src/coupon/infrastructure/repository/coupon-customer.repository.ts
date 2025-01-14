import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CouponCustomerORMEntity } from '../models/orm-coupon-customer';
import { ICouponCustomerRepository } from '../../domain/repositories/coupon-customer-repository.interface';
import { Result } from '../../../common/domain/result-handler/result';

@Injectable()
export class CouponCustomerRepository extends Repository<CouponCustomerORMEntity> implements ICouponCustomerRepository {
  constructor(dataSource: DataSource) {
    super(CouponCustomerORMEntity, dataSource.createEntityManager());
  }

  async saveCouponCustomerRelation(couponId: string, customerId: string, remainingUses: number): Promise<Result<{ id: string }>> {
    try {
      const existingRelation = await this.createQueryBuilder('CouponCustomer')
        .select(['CouponCustomer.id', 'CouponCustomer.coupon', 'CouponCustomer.customer', 'CouponCustomer.remainingUses'])
        .where('CouponCustomer.coupon = :couponId', { couponId })
        .andWhere('CouponCustomer.customer = :customerId', { customerId })
        .getOne();

      if (existingRelation) {
        throw new Error('Coupon already claimed');
      }

      const couponCustomer = new CouponCustomerORMEntity();
      couponCustomer.coupon = { id: couponId } as any;
      couponCustomer.customer = { id_Costumer: customerId } as any;
      couponCustomer.remainingUses = remainingUses;
      await this.save(couponCustomer);

      return Result.success<{ id: string }>({ id: couponId }, 200);
    } catch (error) {
      return Result.fail<{ id: string }>(new Error(error.message), 500, error.message);
    }
  }
}
