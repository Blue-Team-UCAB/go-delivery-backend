import { Discount } from '../../domain/discount';
import { IMapper } from '../../../common/application/mapper/mapper.interface';
import { DiscountORMEntity } from '../models/orm-discount.entity';
import { DiscountProductORMEntity } from '../models/orm-discount-product';
import { DiscountBundleORMEntity } from '../models/orm-discount-bundle';
import { DiscountCategoryORMEntity } from '../models/orm-discount-category';
import { ProductId } from '../../../product/domain/value-objects/product.id';
import { BundleId } from '../../../bundle/domain/value-objects/bundle.id';
import { CategoryId } from '../../../category/domain/value-objects/category.id';
import { DiscountId } from '../../domain/value-objects/discount.id';
import { DiscountState, DiscountStates } from '../../domain/value-objects/discount-state';
import { DiscountPercentage } from '../../domain/value-objects/discount-percentage';
import { DiscountExpirationDate } from '../../domain/value-objects/discount-expiration-date';
import { DiscountStartDate } from '../../domain/value-objects/discount-start-date';

export class DiscountMapper implements IMapper<Discount, DiscountORMEntity> {
  async fromDomainToPersistence(domain: Discount): Promise<DiscountORMEntity> {
    const discountORM = new DiscountORMEntity();
    discountORM.id = domain.Id.Id;
    discountORM.startDate = domain.StartDate.StartDate;
    discountORM.expirationDate = domain.ExpirationDate.ExpirationDate;
    discountORM.percentage = domain.Percentage.Percentage;
    discountORM.state = domain.State.State;

    discountORM.discount_Products = (domain.Products || []).map(productId => {
      const discountProductORM = new DiscountProductORMEntity();
      discountProductORM.product = { id_Product: productId.Id } as any;
      return discountProductORM;
    });

    discountORM.discount_Bundles = (domain.Bundles || []).map(bundleId => {
      const discountBundleORM = new DiscountBundleORMEntity();
      discountBundleORM.bundle = { id: bundleId.Id } as any;
      return discountBundleORM;
    });

    discountORM.discount_Categories = (domain.Categories || []).map(categoryId => {
      const discountCategoryORM = new DiscountCategoryORMEntity();
      discountCategoryORM.category = { id_Category: categoryId.Id } as any;
      return discountCategoryORM;
    });

    return discountORM;
  }

  async fromPersistenceToDomain(persistence: DiscountORMEntity): Promise<Discount> {
    const products = persistence.discount_Products.map(discountProduct => {
      return ProductId.create(discountProduct.product.id_Product);
    });

    const bundles = persistence.discount_Bundles.map(discountBundle => {
      return BundleId.create(discountBundle.bundle.id);
    });

    const categories = persistence.discount_Categories.map(discountCategory => {
      return CategoryId.create(discountCategory.category.id_Category);
    });

    return new Discount(
      DiscountId.create(persistence.id),
      DiscountStartDate.create(persistence.startDate),
      DiscountExpirationDate.create(persistence.expirationDate, persistence.startDate),
      DiscountPercentage.create(persistence.percentage),
      DiscountState.create(persistence.state as DiscountStates),
      products,
      bundles,
      categories,
    );
  }
}
