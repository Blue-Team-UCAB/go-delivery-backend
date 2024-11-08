import { Product as ProductoORM } from '../models/orm-product.entity';
import { DataSource, Repository } from 'typeorm';

export class ProductRepository extends Repository<ProductoORM> {
  constructor(dataSource: DataSource) {
    super(ProductoORM, dataSource.createEntityManager());
  }
}
