import { Injectable } from '@nestjs/common';
import { IDiscountRepository } from '../../domain/repositories/discount-repository.interface';
import { Brackets, DataSource, Repository } from 'typeorm';
import { DiscountORMEntity } from '../models/orm-discount.entity';
import { DiscountMapper } from '../mappers/discount.mapper';
import { Result } from '../../../common/domain/result-handler/result';
import { Discount } from '../../domain/discount';
import { Product } from '../../../product/domain/product';
import { Bundle } from '../../../bundle/domain/bundle';

@Injectable()
export class DiscountRepository extends Repository<DiscountORMEntity> implements IDiscountRepository {
  private readonly discountMapper: DiscountMapper;

  constructor(dataSource: DataSource) {
    super(DiscountORMEntity, dataSource.createEntityManager());
    this.discountMapper = new DiscountMapper();
  }

  async saveDiscountAggregate(discount: Discount): Promise<Result<Discount>> {
    try {
      const discountORM = await this.discountMapper.fromDomainToPersistence(discount);
      await this.save(discountORM);
      return Result.success<Discount>(discount, 200);
    } catch (error) {
      return Result.fail<Discount>(new Error(error.message), error.code, error.message);
    }
  }

  async findDiscountByProduct(product: Product, currentDate: Date): Promise<Result<Discount[]>> {
    try {
      const categoryIds = product.Categories.map(c => c.Id.Id);

      const discounts = await this.createQueryBuilder('discount')
        .leftJoinAndSelect('discount.discount_Products', 'discountProduct')
        .leftJoinAndSelect('discount.discount_Categories', 'discountCategory')
        .leftJoinAndSelect('discountProduct.product', 'product')
        .leftJoinAndSelect('discountCategory.category', 'category')
        .where('product.id_Product = :productId', { productId: product.Id.Id })
        .orWhere('category.id_Category IN (:...categoryIds)', { categoryIds })
        .andWhere(
          new Brackets(qb => {
            qb.where('discount.state = :state', { state: 'ACTIVE' }).orWhere('discount.expirationDate > :currentDate', { currentDate });
          }),
        )
        .getMany();

      const discountDomains = await Promise.all(discounts.map(discount => this.discountMapper.fromPersistenceToDomain(discount)));
      return Result.success<Discount[]>(discountDomains, 200);
    } catch (error) {
      return Result.fail<Discount[]>(null, 500, error.message);
    }
  }

  async findDiscountByBundle(bundle: Bundle, currentDate: Date): Promise<Result<Discount[]>> {
    try {
      const discounts = await this.createQueryBuilder('discount')
        .leftJoinAndSelect('discount.discount_Bundles', 'discountBundle')
        .leftJoinAndSelect('discountBundle.bundle', 'bundle')
        .where('bundle.id = :bundleId', { bundleId: bundle.Id.Id })
        .andWhere('discount.state = :state OR discount.expirationDate > :currentDate', { state: 'ACTIVE', currentDate })
        .getMany();
      const discountDomains = await Promise.all(discounts.map(discount => this.discountMapper.fromPersistenceToDomain(discount)));
      return Result.success<Discount[]>(discountDomains, 200);
    } catch (error) {
      return Result.fail<Discount[]>(null, 500, error.message);
    }
  }
}
