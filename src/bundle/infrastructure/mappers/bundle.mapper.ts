import { Bundle } from '../../domain/bundle';
import { BundleORMEntity } from '../models/orm-bundle.entity';
import { BundleProduct } from '../../domain/entities/bundle-product';
import { BundleProductORMEntity } from '../models/orm-bundle-product.entity';
import { BundleBundleORMEntity } from '../models/orm-bundle-bundle.entity';
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
      productORM.product = { id_Producto: product.Id.Id } as any;
      productORM.quantity = product.Quantity.Quantity;
      return productORM;
    });

    bundleORM.parentBundles = domain.Products.filter(product => product instanceof BundleEntity).map(product => {
      const bundleEntityORM = new BundleBundleORMEntity();
      bundleEntityORM.childBundle = { id: product.Id.Id } as any;
      bundleEntityORM.quantity = product.Quantity.Quantity;
      return bundleEntityORM;
    });

    return bundleORM;
  }

  async fromPersistenceToDomain(persistence: BundleORMEntity, includeProducts: boolean = true): Promise<Bundle> {
    const products = includeProducts
      ? await Promise.all(
          persistence.bundleProducts.map(async bundleProduct => {
            const product = bundleProduct.product;
            if (!product) {
              throw new Error(`Product with ID ${bundleProduct.product.id_Producto} not found`);
            }
            return new BundleProduct(
              new ProductId(product.id_Producto),
              new ProductName(product.nombre_Producto),
              new ProductPrice(product.price_Producto),
              new ProductWeight(product.weight_Producto),
              new ProductImage(product.imagen_Producto),
              new BundleProductQuantity(bundleProduct.quantity),
            );
          }),
        )
      : [];

    const bundles = includeProducts
      ? await Promise.all(
          persistence.parentBundles.map(async bundleBundle => {
            const childBundle = bundleBundle.childBundle;
            if (!childBundle) {
              throw new Error(`Bundle with ID ${bundleBundle.childBundle.id} not found`);
            }
            return new BundleEntity(
              new BundleId(childBundle.id),
              new BundleName(childBundle.name),
              new BundlePrice(childBundle.price),
              new BundleWeight(childBundle.weight),
              new BundleImage(childBundle.imageUrl),
              new BundleQuantity(bundleBundle.quantity),
            );
          }),
        )
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
      [...products, ...bundles],
    );
    return bundle;
  }
}
