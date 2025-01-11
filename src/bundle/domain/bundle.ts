import { AggregateRoot } from '../../common/domain/aggregate-root';
import { BundleId } from './value-objects/bundle.id';
import { BundleName } from './value-objects/bundle-name';
import { BundleDescription } from './value-objects/bundle-description';
import { BundleCurrency } from './value-objects/bundle-currency';
import { BundlePrice } from './value-objects/bundle-price';
import { BundleStock } from './value-objects/bundle-stock';
import { BundleWeight } from './value-objects/bundle-weight';
import { BundleImage } from './value-objects/bundle-image';
import { BundleCaducityDate } from './value-objects/bundle-caducity-date';
import { PricableAndWeightable } from '../../bundle/domain/interfaces/bundle-composite';
import { BundleCreatedEvent } from './events/bundle-created.event';
import { DomainEvent } from '../../common/domain/domain-event';
import { BundleCategory } from './entities/bundle-category';

export class Bundle extends AggregateRoot<BundleId> implements PricableAndWeightable {
  private name: BundleName;
  private description: BundleDescription;
  private currency: BundleCurrency;
  private price: BundlePrice;
  private stock: BundleStock;
  private weight: BundleWeight;
  private imageUrl: BundleImage;
  private caducityDate: BundleCaducityDate;
  private products: PricableAndWeightable[];
  private categories: BundleCategory[];

  calculatePrice(): number {
    const totalPrice = this.products.reduce((total, product) => total + product.calculatePrice(), 0);
    this.price = BundlePrice.create(totalPrice);
    return totalPrice;
  }

  calculateWeight(): number {
    const totalWeight = this.products.reduce((total, product) => total + product.calculateWeight(), 0);
    this.weight = BundleWeight.create(totalWeight);
    return totalWeight;
  }

  get Name(): BundleName {
    return this.name;
  }

  get Description(): BundleDescription {
    return this.description;
  }

  get Currency(): BundleCurrency {
    return this.currency;
  }

  get Price(): BundlePrice {
    return this.price;
  }

  get Stock(): BundleStock {
    return this.stock;
  }

  get Weight(): BundleWeight {
    return this.weight;
  }

  get ImageUrl(): BundleImage {
    return this.imageUrl;
  }

  get CaducityDate(): BundleCaducityDate {
    return this.caducityDate;
  }

  get Products(): PricableAndWeightable[] {
    return this.products;
  }

  get Categories(): BundleCategory[] {
    return this.categories;
  }

  constructor(
    id: BundleId,
    name: BundleName,
    description: BundleDescription,
    currency: BundleCurrency,
    price: BundlePrice,
    stock: BundleStock,
    weight: BundleWeight,
    imageUrl: BundleImage,
    caducityDate: BundleCaducityDate,
    products: PricableAndWeightable[],
    categories: BundleCategory[],
  ) {
    const bundleCreated = BundleCreatedEvent.create(id, name, description, currency, price, stock, weight, imageUrl, caducityDate, products, categories);
    super(id, bundleCreated);
  }

  protected checkValidState(): void {
    if (!this.name || !this.description || !this.currency || !this.price || !this.stock || !this.weight || !this.imageUrl || !this.caducityDate || !this.categories) {
      throw new Error('Bundle is not valid');
    }
  }

  protected when(event: DomainEvent): void {
    if (event instanceof BundleCreatedEvent) {
      this.name = event.name;
      this.description = event.description;
      this.currency = event.currency;
      this.price = event.price;
      this.stock = event.stock;
      this.weight = event.weight;
      this.imageUrl = event.imageUrl;
      this.caducityDate = event.caducityDate;
      this.products = event.products;
      this.categories = event.categories;
    }
  }
}
