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
import { ProductCategory } from '../../domain/value-objects/product-category';

export class ProductMapper implements IMapper<Product, ProductORMEntity> {
  async fromDomainToPersistence(domain: Product): Promise<ProductORMEntity> {
    const productORM = new ProductORMEntity();
    productORM.id_Producto = domain.Id.Id;
    productORM.descripcion_Producto = domain.Description.Description;
    productORM.nombre_Producto = domain.Name.Name;
    productORM.imagen_Producto = domain.ImageUrl.Url;
    productORM.currency_Producto = domain.Currency.Currency;
    productORM.price_Producto = domain.Price.Price;
    productORM.stock_Producto = domain.Stock.Stock;
    productORM.weight_Producto = domain.Weight.Weight;
    productORM.categories_Producto = domain.Categories.map(category => category.Category);
    return productORM;
  }
  async fromPersistenceToDomain(persistence: ProductORMEntity): Promise<Product> {
    return new Product(
      ProductId.create(persistence.id_Producto),
      ProductName.create(persistence.nombre_Producto),
      ProductDescription.create(persistence.descripcion_Producto),
      ProductCurrency.create(persistence.currency_Producto),
      ProductPrice.create(persistence.price_Producto),
      ProductStock.create(persistence.stock_Producto),
      ProductWeight.create(persistence.weight_Producto),
      ProductImage.create(persistence.imagen_Producto),
      persistence.categories_Producto.map(category => ProductCategory.create(category)),
    );
  }
}
