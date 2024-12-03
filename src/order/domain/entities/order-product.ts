import { ProductId } from '../../../product/domain/value-objects/product.id';
import { Entity } from '../../../common/domain/entity';
import { OrderProductName } from '../value-objects/order-product-name';
import { OrderProductPrice } from '../value-objects/order-product-price';
import { OrderProductImage } from '../value-objects/order-product-image';
import { OrderProductQuantity } from '../value-objects/order-product-quantity';

export class OrderProduct extends Entity<ProductId> {
  constructor(
    id: ProductId,
    private readonly name: OrderProductName,
    private readonly price: OrderProductPrice,
    private readonly image: OrderProductImage,
    private readonly quantity: OrderProductQuantity,
  ) {
    super(id);
  }

  get Name(): OrderProductName {
    return this.name;
  }

  get Price(): OrderProductPrice {
    return this.price;
  }

  get Image(): OrderProductImage {
    return this.image;
  }

  get Quantity(): OrderProductQuantity {
    return this.quantity;
  }
}
