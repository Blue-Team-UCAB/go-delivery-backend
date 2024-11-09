import { IProductRepository } from 'src/product/domain/repositories/product-repository.interface';
import { ProductORMEntity as ProductoORM } from '../models/orm-product.entity';
import { DataSource, Repository } from 'typeorm';
import { Result } from 'src/common/Domain/result-handler/Result';
import { Product } from 'src/product/domain/product';
import { ProductMapper } from '../mappers/product.mapper';

export class ProductRepository extends Repository<ProductoORM> implements IProductRepository {
  private readonly productMapper: ProductMapper;

  constructor(dataSource: DataSource) {
    super(ProductoORM, dataSource.createEntityManager());
    this.productMapper = new ProductMapper();
  }

  findProductById(id: string): Promise<Result<Product>> {
    throw new Error('Method not implemented.');
  }

  async saveProductAggregate(product: Product): Promise<Result<Product>> {
    try {
      const newProduct = await this.productMapper.fromDomainToPersistence(product);
      await this.save(newProduct);
      return Result.success<Product>(product, 200);
    } catch (error) {
      return Result.fail<Product>(new Error(error.message), error.code, error.message);
    }
  }
}
