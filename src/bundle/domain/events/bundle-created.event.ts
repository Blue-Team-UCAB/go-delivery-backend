import { DomainEvent } from '../../../common/domain/domain-event';
import { PricableAndWeightable } from '../interfaces/bundle-composite';
import { BundleCaducityDate } from '../value-objects/bundle-caducity-date';
import { BundleCurrency } from '../value-objects/bundle-currency';
import { BundleDescription } from '../value-objects/bundle-description';
import { BundleImage } from '../value-objects/bundle-image';
import { BundleName } from '../value-objects/bundle-name';
import { BundlePrice } from '../value-objects/bundle-price';
import { BundleStock } from '../value-objects/bundle-stock';
import { BundleWeight } from '../value-objects/bundle-weight';
import { BundleId } from '../value-objects/bundle.id';

export class BundleCreatedEvent extends DomainEvent {
  protected constructor(
    public id: BundleId,
    public name: BundleName,
    public description: BundleDescription,
    public currency: BundleCurrency,
    public price: BundlePrice,
    public stock: BundleStock,
    public weight: BundleWeight,
    public imageUrl: BundleImage,
    public caducityDate: BundleCaducityDate,
    public products: PricableAndWeightable[],
  ) {
    super();
  }

  static create(
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
  ): BundleCreatedEvent {
    return new BundleCreatedEvent(id, name, description, currency, price, stock, weight, imageUrl, caducityDate, products);
  }
}
