import { Bundle } from '../../domain/bundle';
import { BundleORMEntity } from '../models/orm-bundle.entity';
import { BundleProduct } from '../../domain/entities/bundle-product';
import { BundleProductORMEntity } from '../models/orm-bundle-product.entity';
// import { BundleBundleORMEntity } from '../models/orm-bundle-bundle.entity';
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
// import { BundleQuantity } from '../../domain/value-objects/bundle-quantity';
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

    // bundleORM.parentBundles = domain.Products.filter(product => product instanceof BundleEntity).map(product => {
    //   const bundleEntityORM = new BundleBundleORMEntity();
    //   bundleEntityORM.childBundle = { id: product.Id.Id } as any;
    //   bundleEntityORM.quantity = product.Quantity.Quantity;
    //   return bundleEntityORM;
    // });

    return bundleORM;
  }

  async fromPersistenceToDomain(persistence: BundleORMEntity, includeProducts: boolean = true): Promise<Bundle> {
    const products = includeProducts
      ? await Promise.all(
          persistence.bundleProducts.map(async bundleProduct => {
            const product = bundleProduct.product;
            if (!product) {
              throw new Error(`Product with ID ${bundleProduct.product.id_Product} not found`);
            }
            return new BundleProduct(
              ProductId.create(product.id_Product),
              ProductName.create(product.name_Product),
              ProductPrice.create(product.price_Product),
              ProductWeight.create(product.weight_Product),
              ProductImage.create(product.image_Product),
              BundleProductQuantity.create(bundleProduct.quantity),
            );
          }),
        )
      : [];

    // const bundles = includeProducts
    //   ? await Promise.all(
    //       persistence.parentBundles.map(async bundleBundle => {
    //         const childBundle = bundleBundle.childBundle;
    //         if (!childBundle) {
    //           throw new Error(`Bundle with ID ${bundleBundle.childBundle.id} not found`);
    //         }
    //         return new BundleEntity(
    //           BundleId.create(childBundle.id),
    //           BundleName.create(childBundle.name),
    //           BundlePrice.create(childBundle.price),
    //           BundleWeight.create(childBundle.weight),
    //           BundleImage.create(childBundle.imageUrl),
    //           BundleQuantity.create(bundleBundle.quantity),
    //         );
    //       }),
    //     )
    //   : [];

    const bundle = new Bundle(
      BundleId.create(persistence.id),
      BundleName.create(persistence.name),
      BundleDescription.create(persistence.description),
      BundleCurrency.create(persistence.currency),
      BundlePrice.create(persistence.price),
      BundleStock.create(persistence.stock),
      BundleWeight.create(persistence.weight),
      BundleImage.create(persistence.imageUrl),
      BundleCaducityDate.create(persistence.caducityDate),
      [...products /*, ...bundles*/],
    );
    return bundle;
  }
}
