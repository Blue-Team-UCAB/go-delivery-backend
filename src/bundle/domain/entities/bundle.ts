import { Entity } from '../../../common/domain/entity';
import { BundleName } from '../value-objects/bundle-name';
import { BundlePrice } from '../value-objects/bundle-price';
import { BundleWeight } from '../value-objects/bundle-weight';
import { BundleId } from '../value-objects/bundle.id';
import { PricableAndWeightable } from '../interfaces/bundle-composite';
import { BundleQuantity } from '../value-objects/bundle-quantity';
import { BundleImage } from '../value-objects/bundle-image';

export class BundleEntity extends Entity<BundleId> implements PricableAndWeightable {
  constructor(
    id: BundleId,
    private readonly name: BundleName,
    private readonly price: BundlePrice,
    private readonly weight: BundleWeight,
    private readonly image: BundleImage,
    private readonly quantity: BundleQuantity,
  ) {
    super(id);
  }

  get Name(): BundleName {
    return this.name;
  }

  get Price(): BundlePrice {
    return this.price;
  }

  get Weight(): BundleWeight {
    return this.weight;
  }

  get Image(): BundleImage {
    return this.image;
  }

  get Quantity(): BundleQuantity {
    return this.quantity;
  }

  calculatePrice(): number {
    return this.price.Price;
  }

  calculateWeight(): number {
    return this.weight.Weight;
  }
}
