import { AggregateRoot } from 'src/common/domain/aggregate-root';
import { DiscountId } from './value-objects/discount.id';
import { DiscountStartDate } from './value-objects/discount-start-date';
import { DiscountExpirationDate } from './value-objects/discount-expiration-date';
import { DiscountPercentage } from './value-objects/discount-percentage';
import { DomainEvent } from 'src/common/domain/domain-event';
import { DiscountCreatedEvent } from './events/discount-created.event';
import { DiscountState } from './value-objects/discount-state';
import { ProductId } from '../../product/domain/value-objects/product.id';
import { BundleId } from '../../bundle/domain/value-objects/bundle.id';
import { InvalidDiscountException } from './exceptions/invalid-discount.exception';
import { CategoryId } from '../../category/domain/value-objects/category.id';

export class Discount extends AggregateRoot<DiscountId> {
  private startingDate: DiscountStartDate;
  private expirationDate: DiscountExpirationDate;
  private percentage: DiscountPercentage;
  private state: DiscountState;
  private products: ProductId[];
  private bundles: BundleId[];
  private categories: CategoryId[];

  get StartDate(): DiscountStartDate {
    return this.startingDate;
  }

  get ExpirationDate(): DiscountExpirationDate {
    return this.expirationDate;
  }

  get Percentage(): DiscountPercentage {
    return this.percentage;
  }

  get State(): DiscountState {
    return this.state;
  }

  get Products(): ProductId[] {
    return this.products;
  }

  get Bundles(): BundleId[] {
    return this.bundles;
  }

  get Categories(): CategoryId[] {
    return this.categories;
  }

  constructor(
    id: DiscountId,
    startDate: DiscountStartDate,
    expirationDate: DiscountExpirationDate,
    percentage: DiscountPercentage,
    state: DiscountState,
    products: ProductId[],
    bundles: BundleId[],
    categories: CategoryId[],
  ) {
    const discountCreated = DiscountCreatedEvent.create(id, startDate, expirationDate, percentage, state, products, bundles, categories);
    super(id, discountCreated);
  }

  protected checkValidState(): void {
    if (!this.startingDate || !this.expirationDate || !this.percentage || !this.state) {
      throw new InvalidDiscountException('Discount not valid');
    }
  }

  protected when(event: DomainEvent): void {
    if (event instanceof DiscountCreatedEvent) {
      this.startingDate = event.startDate;
      this.expirationDate = event.expirationDate;
      this.percentage = event.percentage;
      this.state = event.state;
      this.products = event.products;
      this.bundles = event.bundles;
      this.categories = event.categories;
    }
  }
}
