import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { ICouponRepository } from '../../domain/repositories/coupon-repository.interface';
import { CouponORMEntity } from '../models/orm-coupon.entity';
import { CouponMapper } from '../mappers/coupon.mapper';
import { Coupon } from '../../domain/coupon';
import { Result } from '../../../common/domain/result-handler/result';

@Injectable()
export class CouponRepository extends Repository<CouponORMEntity> implements ICouponRepository {
  private readonly couponMapper: CouponMapper;

  constructor(dataSource: DataSource) {
    super(CouponORMEntity, dataSource.createEntityManager());
    this.couponMapper = new CouponMapper();
  }

  async findCouponById(id: string): Promise<Result<Coupon>> {
    try {
      const coupon = await this.findOne({ where: { id } });

      if (!coupon) {
        return Result.fail<Coupon>(null, 404, 'Coupon not found');
      }

      const couponDomain = await this.couponMapper.fromPersistenceToDomain(coupon);
      return Result.success<Coupon>(couponDomain, 200);
    } catch (error) {
      return Result.fail<Coupon>(null, 500, error.message);
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
      return Result.fail<Coupon[]>(null, 500, error.message);
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

  async validateCoupon(code: string, currentDate: Date, customerId: string): Promise<Result<Coupon>> {
    try {
      const coupon = await this.createQueryBuilder('coupon')
        .where('coupon.code = :code', { code })
        .andWhere('coupon.startDate <= :currentDate', { currentDate })
        .andWhere('coupon.expirationDate >= :currentDate', { currentDate })
        .getOne();

      if (!coupon) {
        return Result.fail<Coupon>(null, 400, 'Coupon not found or not valid');
      }
      const couponId = coupon.id;

      const orderCount = await this.manager
        .createQueryBuilder('OrderORMEntity', 'o')
        .where('o.customerOrdersIdCostumer = :customerId', { customerId })
        .andWhere('o.couponId = :couponId', { couponId })
        .getCount();

      if (orderCount >= coupon.numberUses) {
        return Result.fail<Coupon>(null, 400, 'Coupon usage limit reached for this customer');
      }

      const couponDomain = await this.couponMapper.fromPersistenceToDomain(coupon);
      return Result.success<Coupon>(couponDomain, 200);
    } catch (error) {
      return Result.fail<Coupon>(new Error(error.message), error.code, error.message);
    }
  }
}
