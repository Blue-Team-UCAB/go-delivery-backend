import { IMapper } from '../../../common/application/mapper/mapper.interface';
import { ProductORMEntity } from '../models/orm-product.entity';
import { Product } from '../../domain/product';
import { ProductId } from '../../domain/value-objects/product.id';
import { ProductName } from '../../domain/value-objects/product-name';
import { ProductDescription } from '../../domain/value-objects/product-description';
import { ProductImage } from '../../domain/value-objects/product-image';
import { ProductCurrency } from '../../domain/value-objects/product-currency';
import { ProductPrice } from '../../domain/value-objects/product-price';
import { ProductStock } from '../../domain/value-objects/product-stock';
import { ProductWeight } from '../../domain/value-objects/product-weight';
import { ProductCategoryORMEntity } from '../models/orm-product-category.entity';
import { ProductCategory } from 'src/product/domain/entities/product-category';
import { CategoryId } from 'src/category/domain/value-objects/category.id';
import { ProductCategoryName } from 'src/product/domain/value-objects/product-category-name';
import { ProductMeasurement } from 'src/product/domain/value-objects/product-measurement';

export class ProductMapper implements IMapper<Product, ProductORMEntity> {
  async fromDomainToPersistence(domain: Product): Promise<ProductORMEntity> {
    const productORM = new ProductORMEntity();
    productORM.id_Product = domain.Id.Id;
    productORM.description_Product = domain.Description.Description;
    productORM.name_Product = domain.Name.Name;
    productORM.image_Product = domain.ImageUrl.Url;
    productORM.currency_Product = domain.Currency.Currency;
    productORM.price_Product = domain.Price.Price;
    productORM.stock_Product = domain.Stock.Stock;
    productORM.weight_Product = domain.Weight.Weight;
    productORM.measurement_Product = domain.Measurement.Measurement;
    productORM.product_Categories = domain.Categories.map(category => {
      const productCategoryORM = new ProductCategoryORMEntity();
      productCategoryORM.category = { id_Category: category.Id.Id } as any;
      return productCategoryORM;
    });
    return productORM;
  }

  async fromPersistenceToDomain(persistence: ProductORMEntity): Promise<Product> {
    const categories = persistence.product_Categories.map(productCategory => {
      return new ProductCategory(CategoryId.create(productCategory.category.id_Category), ProductCategoryName.create(productCategory.category.name_Category));
    });

    return new Product(
      ProductId.create(persistence.id_Product),
      ProductName.create(persistence.name_Product),
      ProductDescription.create(persistence.description_Product),
      ProductCurrency.create(persistence.currency_Product),
      ProductPrice.create(persistence.price_Product),
      ProductStock.create(persistence.stock_Product),
      ProductWeight.create(persistence.weight_Product),
      ProductMeasurement.create(persistence.measurement_Product),
      ProductImage.create(persistence.image_Product),
      categories,
    );
  }
}
