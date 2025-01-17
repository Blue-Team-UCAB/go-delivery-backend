import { DiscountId } from '../value-objects/discount.id';
import { DomainEvent } from '../../../common/domain/domain-event';
import { DiscountStartDate } from '../value-objects/discount-start-date';
import { DiscountExpirationDate } from '../value-objects/discount-expiration-date';
import { DiscountPercentage } from '../value-objects/discount-percentage';
import { DiscountState } from '../value-objects/discount-state';
import { ProductId } from '../../../product/domain/value-objects/product.id';
import { BundleId } from '../../../bundle/domain/value-objects/bundle.id';
import { CategoryId } from '../../../category/domain/value-objects/category.id';

export class DiscountCreatedEvent extends DomainEvent {
  protected constructor(
    public id: DiscountId,
    public startDate: DiscountStartDate,
    public expirationDate: DiscountExpirationDate,
    public percentage: DiscountPercentage,
    public state: DiscountState,
    public products: ProductId[],
    public bundles: BundleId[],
    public categories: CategoryId[],
  ) {
    super();
  }

  static create(
    id: DiscountId,
    startDate: DiscountStartDate,
    expirationDate: DiscountExpirationDate,
    percentage: DiscountPercentage,
    state: DiscountState,
    products: ProductId[],
    bundles: BundleId[],
    categories: CategoryId[],
  ): DiscountCreatedEvent {
    return new DiscountCreatedEvent(id, startDate, expirationDate, percentage, state, products, bundles, categories);
  }
}
