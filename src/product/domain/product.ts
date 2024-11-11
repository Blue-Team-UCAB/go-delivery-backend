import { AggregateRoot } from '../../common/domain/aggregate-root';
import { ProductId } from './value-objects/product.id';
import { ProductName } from './value-objects/product-name';
import { ProductDescription } from './value-objects/product-description';
import { ProductCreatedEvent } from './events/product-created.event';
import { InvalidProductException } from './exceptions/invalid-product.exception';
import { DomainEvent } from '../../common/domain/domain-event';
import { ProductImage } from './value-objects/product-image';
import { ProductCurrency } from './value-objects/product-currency';
import { ProductPrice } from './value-objects/product-price';
import { ProductStock } from './value-objects/product-stock';
import { ProductWeight } from './value-objects/product-weight';
import { ProductCategory } from './value-objects/product-category';

export class Product extends AggregateRoot<ProductId> {
  private name: ProductName;
  private description: ProductDescription;
  private currency: ProductCurrency;
  private price: ProductPrice;
  private stock: ProductStock;
  private weight: ProductWeight;
  private imageUrl: ProductImage;
  private categories: ProductCategory[];

  get Name(): ProductName {
    return this.name;
  }

  get Description(): ProductDescription {
    return this.description;
  }

  get ImageUrl(): ProductImage {
    return this.imageUrl;
  }

  get Currency(): ProductCurrency {
    return this.currency;
  }

  get Price(): ProductPrice {
    return this.price;
  }

  get Stock(): ProductStock {
    return this.stock;
  }

  get Weight(): ProductWeight {
    return this.weight;
  }

  get Categories(): ProductCategory[] {
    return this.categories;
  }

  constructor(
    id: ProductId,
    name: ProductName,
    description: ProductDescription,
    currency: ProductCurrency,
    price: ProductPrice,
    stock: ProductStock,
    weight: ProductWeight,
    imageUrl: ProductImage,
    categories: ProductCategory[],
  ) {
    const productCreated = ProductCreatedEvent.create(id, name, description, currency, price, stock, weight, imageUrl, categories);
    super(id, productCreated);
  }

  protected checkValidState(): void {
    if (!this.name || !this.description || !this.imageUrl || !this.currency || !this.price || !this.stock || !this.weight || !this.categories) throw new InvalidProductException(`Product not valid`);
  }

  protected when(event: DomainEvent): void {
    if (event instanceof ProductCreatedEvent) {
      this.name = event.name;
      this.description = event.description;
      this.currency = event.currency;
      this.price = event.price;
      this.stock = event.stock;
      this.weight = event.weight;
      this.imageUrl = event.imageUrl;
      this.categories = event.categories;
    }
  }
}
