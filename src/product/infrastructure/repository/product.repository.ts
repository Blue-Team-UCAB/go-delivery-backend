import { IProductRepository } from 'src/product/domain/repositories/product-repository.interface';
import { ProductORMEntity as ProductoORM } from '../models/orm-product.entity';
import { DataSource, Repository } from 'typeorm';
import { Result } from 'src/common/Domain/result-handler/Result';
import { Product } from 'src/product/domain/product';
import { ProductMapper } from '../mappers/product.mapper';
import { GetProductPageServiceEntryDto } from 'src/product/aplication/dto/entry/get-product-page-service-entry.dto';

export class ProductRepository extends Repository<ProductoORM> implements IProductRepository {
  private readonly productMapper: ProductMapper;

  constructor(dataSource: DataSource) {
    super(ProductoORM, dataSource.createEntityManager());
    this.productMapper = new ProductMapper();
  }

  async findProductById(id: string): Promise<Result<Product>> {
    try {
      const produt = await this.createQueryBuilder('producto')
        .select(['producto.id_Producto', 'producto.nombre_Producto', 'producto.descripcion_Producto', 'producto.imagen_Producto'])
        .where('producto.id_Producto = :id', { id })
        .getOne();
      const resp = await this.productMapper.fromPersistenceToDomain(produt);
      if (!resp) {
        return Result.fail(null, 404, 'No existe el producto Solicitado');
      }

      return Result.success<Product>(resp, 200);
    } catch (e) {
      return Result.fail(null, 500, e.message);
    }
  }

  async findAllProducts(page: number, take: number): Promise<Result<Product[]>> {
    try {
      const skip = take * page - take;
      const products = await this.createQueryBuilder('producto').select(['producto.id_Producto', 'producto.nombre_Producto', 'producto.descripcion_Producto']).skip(skip).take(take).getMany();
      const resp = await Promise.all(products.map(product => this.productMapper.fromPersistenceToDomain(product)));
      return Result.success<Product[]>(resp, 200);
    } catch (e) {
      return Result.fail(null, 500, e.message);
    }
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
