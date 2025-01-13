import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { ICouponRepository } from '../../domain/repositories/coupon-repository.interface';
import { CouponORMEntity } from '../models/orm-coupon.entity';
import { CouponMapper } from '../mappers/coupon.mapper';
import { Coupon } from '../../domain/coupon';
import { Result } from '../../../common/domain/result-handler/result';
import { CouponCustomerORMEntity } from '../models/orm-coupon-costumer';

@Injectable()
export class CouponRepository extends Repository<CouponORMEntity> implements ICouponRepository {
  private readonly couponMapper: CouponMapper;

  constructor(dataSource: DataSource) {
    super(CouponORMEntity, dataSource.createEntityManager());
    this.couponMapper = new CouponMapper();
  }

  async findCouponById(id: string): Promise<Result<Coupon>> {
    try {
      const coupon = await this.findOne({
        where: { id },
        relations: ['coupon_Customers', 'coupon_Customers.customer'],
      });

      if (!coupon) {
        return Result.fail<Coupon>(null, 404, 'Coupon not found');
      }

      const couponDomain = await this.couponMapper.fromPersistenceToDomain(coupon);
      return Result.success<Coupon>(couponDomain, 200);
    } catch (error) {
      return Result.fail<Coupon>(new Error(error.message), 500, error.message);
    }
  }

  async findCouponByCode(code: string): Promise<Result<Coupon>> {
    try {
      const coupon = await this.findOne({
        where: { code },
        relations: ['coupon_Customers', 'coupon_Customers.customer'],
      });

      if (!coupon) {
        return Result.fail<Coupon>(null, 404, 'Coupon not found');
      }

      const couponDomain = await this.couponMapper.fromPersistenceToDomain(coupon);
      return Result.success<Coupon>(couponDomain, 200);
    } catch (error) {
      return Result.fail<Coupon>(new Error(error.message), 500, error.message);
    }
  }

  async findApplicableCouponsByCustomer(customerId: string): Promise<Result<Coupon[]>> {
    try {
      const coupons = await this.createQueryBuilder('coupon')
        .innerJoinAndSelect('coupon.coupon_Customers', 'couponCustomer')
        .innerJoinAndSelect('couponCustomer.customer', 'customer')
        .where('customer.id_Costumer = :customerId', { customerId })
        .andWhere('couponCustomer.remainingUses > 0')
        .getMany();

      const couponDomains = await Promise.all(coupons.map(coupon => this.couponMapper.fromPersistenceToDomain(coupon)));
      return Result.success<Coupon[]>(couponDomains, 200);
    } catch (error) {
      return Result.fail<Coupon[]>(new Error(error.message), 500, error.message);
    }
  }

  async findAllCoupons(page: number, perpage: number, search?: string): Promise<Result<Coupon[]>> {
    try {
      const skip = perpage * page - perpage;
      const query = this.createQueryBuilder('coupon')
        .select(['coupon.id', 'coupon.startDate', 'coupon.expirationDate', 'coupon.porcentage', 'coupon.code', 'coupon.title', 'coupon.message', 'coupon.numberUses'])
        .where('coupon.expirationDate > :currentDate', { currentDate: new Date(Date.now()) })
        .skip(skip)
        .take(perpage);

      if (search) {
        query.andWhere('coupon.code ILIKE :search OR coupon.title ILIKE :search', { search: `%${search}%` });
      }

      const couponsORM = await query.getMany();
      const coupons = await Promise.all(couponsORM.map(coupon => this.couponMapper.fromPersistenceToDomain(coupon)));
      return Result.success<Coupon[]>(coupons, 200);
    } catch (error) {
      return Result.fail<Coupon[]>(new Error(error.message), 500, error.message);
    }
  }

  async saveCouponAggregate(coupon: Coupon): Promise<Result<Coupon>> {
    try {
      const couponORM = await this.couponMapper.fromDomainToPersistence(coupon);
      await this.save(couponORM);
      return Result.success<Coupon>(coupon, 200);
    } catch (error) {
      return Result.fail<Coupon>(new Error(error.message), error.code, error.message);
    }
  }

  async updateRemainingUses(couponId: string, customerId: string, remainingUses: number): Promise<Result<void>> {
    try {
      const result = await this.createQueryBuilder()
        .update(CouponCustomerORMEntity)
        .set({ remainingUses })
        .where('couponId = :couponId', { couponId })
        .andWhere('"customerIdCostumer" = :customerId', { customerId })
        .execute();

      if (result.affected === 0) {
        return Result.fail<void>(null, 404, 'No rows were updated');
      }
      return Result.success<void>(undefined, 200);
    } catch (error) {
      return Result.fail<void>(new Error(error.message), error.code, error.message);
    }
  }

  // async validateCoupon(code: string, currentDate: Date, customerId: string): Promise<Result<Coupon>> {
  //   try {
  //     const coupon = await this.createQueryBuilder('coupon')
  //       .where('coupon.code = :code', { code })
  //       .andWhere('coupon.startDate <= :currentDate', { currentDate })
  //       .andWhere('coupon.expirationDate >= :currentDate', { currentDate })
  //       .getOne();

  //     if (!coupon) {
  //       return Result.fail<Coupon>(null, 400, 'Coupon not found or not valid');
  //     }
  //     const couponId = coupon.id;

  //     const orderCount = await this.manager
  //       .createQueryBuilder('OrderORMEntity', 'o')
  //       .where('o.customerOrdersIdCostumer = :customerId', { customerId })
  //       .andWhere('o.couponId = :couponId', { couponId })
  //       .getCount();

  //     if (orderCount >= coupon.numberUses) {
  //       return Result.fail<Coupon>(null, 400, 'Coupon usage limit reached for this customer');
  //     }

  //     const couponDomain = await this.couponMapper.fromPersistenceToDomain(coupon);
  //     return Result.success<Coupon>(couponDomain, 200);
  //   } catch (error) {
  //     return Result.fail<Coupon>(new Error(error.message), error.code, error.message);
  //   }
  // }
}
