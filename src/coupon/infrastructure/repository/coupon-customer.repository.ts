import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CouponCustomerORMEntity } from '../models/orm-coupon-customer';
import { ICouponCustomerRepository } from '../../domain/repositories/coupon-customer-repository.interface';
import { Result } from '../../../common/domain/result-handler/result';

@Injectable()
export class CouponCustomerRepository extends Repository<CouponCustomerORMEntity> implements ICouponCustomerRepository {
  constructor(dataSource: DataSource) {
    super(CouponCustomerRepository, dataSource.createEntityManager());
  }

  async saveCouponCustomerRelation(couponId: string, customerId: string, remainingUses: number): Promise<Result<void>> {
    try {
      console.log(couponId, customerId, remainingUses);
      const existingRelation = await this.createQueryBuilder('couponCustomer')
        .select('couponCustomer.id')
        .where('couponCustomer.couponId = :couponId', { couponId })
        .andWhere('couponCustomer.customerIdCostumer = :customerId', { customerId })
        .getOne();
      console.log(existingRelation.id);

      if (existingRelation) {
        return Result.fail<void>(null, 400, 'Coupon already claimed by this customer');
      }

      const newRelation = new CouponCustomerORMEntity();
      newRelation.coupon = { id: couponId } as any;
      newRelation.customer = { id_Costumer: customerId } as any;
      newRelation.remainingUses = remainingUses;

      await this.save(newRelation);
      return Result.success<void>(undefined, 200);
    } catch (error) {
      return Result.fail<void>(new Error(error.message), 500, error.message);
    }
  }
}
