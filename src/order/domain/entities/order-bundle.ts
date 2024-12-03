import { BundleId } from '../../../bundle/domain/value-objects/bundle.id';
import { Entity } from '../../../common/domain/entity';
import { OrderBundleImage } from '../value-objects/order-bundle-image';
import { OrderBundleName } from '../value-objects/order-bundle-name';
import { OrderBundlePrice } from '../value-objects/order-bundle-price';
import { OrderBundleQuantity } from '../value-objects/order-bundle-quantity';

export class OrderBundle extends Entity<BundleId> {
  constructor(
    id: BundleId,
    private readonly name: OrderBundleName,
    private readonly price: OrderBundlePrice,
    private readonly image: OrderBundleImage,
    private readonly quantity: OrderBundleQuantity,
  ) {
    super(id);
  }

  get Name(): OrderBundleName {
    return this.name;
  }

  get Price(): OrderBundlePrice {
    return this.price;
  }

  get Image(): OrderBundleImage {
    return this.image;
  }

  get Quantity(): OrderBundleQuantity {
    return this.quantity;
  }
}
