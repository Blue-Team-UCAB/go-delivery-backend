import { Entity } from '../../../common/domain/entity';
import { ProductId } from '../../../product/domain/value-objects/product.id';
import { ProductName } from '../../../product/domain/value-objects/product-name';
import { ProductPrice } from '../../../product/domain/value-objects/product-price';
import { ProductWeight } from '../../../product/domain/value-objects/product-weight';
import { PricableAndWeightable } from '../interfaces/bundle-composite';
import { BundleProductQuantity } from '../value-objects/bundle-product-quantity';

export class BundleProduct extends Entity<ProductId> implements PricableAndWeightable {
  constructor(
    id: ProductId,
    private readonly name: ProductName,
    private readonly price: ProductPrice,
    private readonly weight: ProductWeight,
    private readonly quantity: BundleProductQuantity,
  ) {
    super(id);
  }

  get Name(): ProductName {
    return this.name;
  }

  get Price(): ProductPrice {
    return this.price;
  }

  get Weight(): ProductWeight {
    return this.weight;
  }

  get Quantity(): BundleProductQuantity {
    return this.quantity;
  }

  calculatePrice(): number {
    return this.price.Price * this.quantity.Quantity;
  }

  calculateWeight(): number {
    return this.weight.Weight * this.quantity.Quantity;
  }
}
