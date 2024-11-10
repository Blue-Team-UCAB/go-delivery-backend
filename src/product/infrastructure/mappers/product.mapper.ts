import { IMapper } from 'src/common/application/mapper/mapper.interface';
import { ProductORMEntity } from '../models/orm-product.entity';
import { Product } from 'src/product/domain/product';
import { ProductId } from 'src/product/domain/value-objects/product.id';
import { ProductName } from 'src/product/domain/value-objects/product-name';
import { ProductDescription } from 'src/product/domain/value-objects/product-description';
import { ProductImage } from 'src/product/domain/value-objects/product-image';

export class ProductMapper implements IMapper<Product, ProductORMEntity> {
  async fromDomainToPersistence(domain: Product): Promise<ProductORMEntity> {
    const productORM = new ProductORMEntity();
    productORM.id_Producto = domain.Id.Id;
    productORM.descripcion_Producto = domain.Description.Description;
    productORM.nombre_Producto = domain.Name.Name;
    productORM.imagen_Producto = domain.ImageUrl.Url;
    return productORM;
  }
  async fromPersistenceToDomain(persistence: ProductORMEntity): Promise<Product> {
    return new Product(
      ProductId.create(persistence.id_Producto),
      ProductName.create(persistence.nombre_Producto),
      ProductDescription.create(persistence.descripcion_Producto),
      ProductImage.create(persistence.imagen_Producto),
    );
  }
}
