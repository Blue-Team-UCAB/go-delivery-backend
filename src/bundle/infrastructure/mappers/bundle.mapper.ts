import { Bundle } from '../../domain/bundle';
import { BundleORMEntity } from '../models/orm-bundle.entity';
import { BundleProduct } from '../../domain/entities/bundle-product';
import { BundleProductORMEntity } from '../models/orm-bundle-product.entity';
import { BundleEntityORMEntity } from '../models/orm-bundle-entity.entity';
import { BundleEntity } from '../../domain/entities/bundle';
import { BundleId } from '../../domain/value-objects/bundle.id';
import { BundleName } from '../../domain/value-objects/bundle-name';
import { BundleDescription } from '../../domain/value-objects/bundle-description';
import { BundleCurrency } from '../../domain/value-objects/bundle-currency';
import { BundlePrice } from '../../domain/value-objects/bundle-price';
import { BundleStock } from '../../domain/value-objects/bundle-stock';
import { BundleWeight } from '../../domain/value-objects/bundle-weight';
import { BundleImage } from '../../domain/value-objects/bundle-image';
import { BundleCaducityDate } from '../../domain/value-objects/bundle-caducity-date';
import { ProductId } from '../../../product/domain/value-objects/product.id';
import { ProductName } from '../../../product/domain/value-objects/product-name';
import { ProductPrice } from '../../../product/domain/value-objects/product-price';
import { ProductWeight } from '../../../product/domain/value-objects/product-weight';
import { BundleProductQuantity } from '../../domain/value-objects/bundle-product-quantity';
import { BundleQuantity } from '../../domain/value-objects/bundle-quantity';
import { IMapper } from '../../../common/application/mapper/mapper.interface';
import { ProductImage } from '../../../product/domain/value-objects/product-image';

export class BundleMapper implements IMapper<Bundle, BundleORMEntity> {
  async fromDomainToPersistence(domain: Bundle): Promise<BundleORMEntity> {
    const bundleORM = new BundleORMEntity();
    bundleORM.id = domain.Id.Id;
    bundleORM.name = domain.Name.Name;
    bundleORM.description = domain.Description.Description;
    bundleORM.currency = domain.Currency.Currency;
    bundleORM.price = domain.Price.Price;
    bundleORM.stock = domain.Stock.Stock;
    bundleORM.weight = domain.Weight.Weight;
    bundleORM.imageUrl = domain.ImageUrl.Url;
    bundleORM.caducityDate = domain.CaducityDate.CaducityDate;
    bundleORM.bundleProducts = domain.Products.filter(product => product instanceof BundleProduct).map(product => {
      const productORM = new BundleProductORMEntity();
      productORM.productId_Bundle_Product = product.Id.Id;
      productORM.name_Bundle_Product = product.Name.Name;
      productORM.price_Bundle_Product = product.Price.Price;
      productORM.weight_Bundle_Product = product.Weight.Weight;
      productORM.imagen_Bundle_Product = product.Image.Url;
      productORM.quantity_Bundle_Product = product.Quantity.Quantity;
      return productORM;
    });
    bundleORM.bundleEntities = domain.Products.filter(product => product instanceof BundleEntity).map(product => {
      const bundleEntityORM = new BundleEntityORMEntity();
      bundleEntityORM.bundleId_Bundle_Entity = product.Id.Id;
      bundleEntityORM.name_Bundle_Entity = product.Name.Name;
      bundleEntityORM.price_Bundle_Entity = product.Price.Price;
      bundleEntityORM.weight_Bundle_Entity = product.Weight.Weight;
      bundleEntityORM.imagen_Bundle_Entity = product.Image.Url;
      bundleEntityORM.quantity_Bundle_Entity = product.Quantity.Quantity;
      return bundleEntityORM;
    });
    return bundleORM;
  }

  async fromPersistenceToDomain(persistence: BundleORMEntity, includeProducts: boolean = true): Promise<Bundle> {
    const products = includeProducts
      ? [
          ...persistence.bundleProducts.map(
            product =>
              new BundleProduct(
                new ProductId(product.productId_Bundle_Product),
                new ProductName(product.name_Bundle_Product),
                new ProductPrice(product.price_Bundle_Product),
                new ProductWeight(product.weight_Bundle_Product),
                new ProductImage(product.imagen_Bundle_Product),
                new BundleProductQuantity(product.quantity_Bundle_Product),
              ),
          ),
          ...persistence.bundleEntities.map(
            bundleEntity =>
              new BundleEntity(
                new BundleId(bundleEntity.bundleId_Bundle_Entity),
                new BundleName(bundleEntity.name_Bundle_Entity),
                new BundlePrice(bundleEntity.price_Bundle_Entity),
                new BundleWeight(bundleEntity.weight_Bundle_Entity),
                new BundleImage(bundleEntity.imagen_Bundle_Entity),
                new BundleQuantity(bundleEntity.quantity_Bundle_Entity),
              ),
          ),
        ]
      : [];

    const bundle = new Bundle(
      new BundleId(persistence.id),
      new BundleName(persistence.name),
      new BundleDescription(persistence.description),
      new BundleCurrency(persistence.currency),
      new BundlePrice(persistence.price),
      new BundleStock(persistence.stock),
      new BundleWeight(persistence.weight),
      new BundleImage(persistence.imageUrl),
      new BundleCaducityDate(persistence.caducityDate),
      products,
    );
    return bundle;
  }
}
