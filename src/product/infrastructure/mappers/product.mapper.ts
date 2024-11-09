import { IMapper } from 'src/common/application/mapper/mapper.interface';
import { ProductORMEntity } from '../models/orm-product.entity';
import { Product } from 'src/product/domain/product';

export class ProductMapper implements IMapper<Product, ProductORMEntity> {
  async fromDomainToPersistence(domain: Product): Promise<ProductORMEntity> {
    const productORM = new ProductORMEntity();
    productORM.id_Producto = domain.Id.Id;
    productORM.descripcion_Producto = domain.Description.Description;
    productORM.nombre_Producto = domain.Name.Name;
    return productORM;
  }
  fromPersistenceToDomain(persistence: ProductORMEntity): Promise<Product> {
    throw new Error('Method not implemented.');
  }
}
