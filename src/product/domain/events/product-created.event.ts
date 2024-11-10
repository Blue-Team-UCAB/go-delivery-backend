import { DomainEvent } from '../../../common/domain/domain-event';
import { ProductId } from '../value-objects/product.id';
import { ProductName } from '../value-objects/product-name';
import { ProductDescription } from '../value-objects/product-description';
import { ProductImage } from '../value-objects/product-image';
import { ProductCurrency } from '../value-objects/product-currency';
import { ProductPrice } from '../value-objects/product-price';
import { ProductStock } from '../value-objects/product-stock';
import { ProductWeight } from '../value-objects/product-weight';

export class ProductCreatedEvent extends DomainEvent {
  protected constructor(
    public id: ProductId,
    public name: ProductName,
    public description: ProductDescription,
    public currency: ProductCurrency,
    public price: ProductPrice,
    public stock: ProductStock,
    public weight: ProductWeight,
    public imageUrl: ProductImage,
  ) {
    super();
  }

  static create(
    id: ProductId,
    name: ProductName,
    description: ProductDescription,
    currency: ProductCurrency,
    price: ProductPrice,
    stock: ProductStock,
    weight: ProductWeight,
    imageUrl: ProductImage,
  ): ProductCreatedEvent {
    return new ProductCreatedEvent(id, name, description, currency, price, stock, weight, imageUrl);
  }
}
