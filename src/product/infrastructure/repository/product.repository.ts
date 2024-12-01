import { IProductRepository } from '../../domain/repositories/product-repository.interface';
import { ProductORMEntity as ProductoORM } from '../models/orm-product.entity';
import { DataSource, Repository } from 'typeorm';
import { Result } from '../../../common/domain/result-handler/result';
import { Product } from '../../domain/product';
import { ProductMapper } from '../mappers/product.mapper';

export class ProductRepository extends Repository<ProductoORM> implements IProductRepository {
  private readonly productMapper: ProductMapper;

  constructor(dataSource: DataSource) {
    super(ProductoORM, dataSource.createEntityManager());
    this.productMapper = new ProductMapper();
  }

  async findProductById(id: string): Promise<Result<Product>> {
    try {
      const product = await this.createQueryBuilder('product')
        .select([
          'product.id_Product',
          'product.name_Product',
          'product.description_Product',
          'product.currency_Product',
          'product.price_Product',
          'product.stock_Product',
          'product.weight_Product',
          'product.image_Product',
          'product.measurement_Product',
          'productCategory.id_',
          'category.id_Category',
          'category.name_Category',
        ])
        .leftJoin('product.product_Categories', 'productCategory')
        .leftJoin('productCategory.category', 'category')
        .where('product.id_Product = :id', { id })
        .getOne();

      const resp = await this.productMapper.fromPersistenceToDomain(product);
      if (!resp) {
        return Result.fail(null, 404, 'The requested product does not exist');
      }

      return Result.success<Product>(resp, 200);
    } catch (e) {
      return Result.fail(null, 500, e.message);
    }
  }

  async findAllProducts(page: number, perpage: number, category?: string, search?: string): Promise<Result<Product[]>> {
    try {
      const skip = perpage * page - perpage;

      const query = this.createQueryBuilder('product')
        .select([
          'product.id_Product',
          'product.name_Product',
          'product.description_Product',
          'product.currency_Product',
          'product.price_Product',
          'product.stock_Product',
          'product.weight_Product',
          'product.image_Product',
          'product.measurement_Product',
          'productCategory.id_',
          'category.id_Category',
          'category.name_Category',
        ])
        .leftJoin('product.product_Categories', 'productCategory')
        .leftJoin('productCategory.category', 'category')
        .skip(skip)
        .take(perpage);

      if (category) {
        query.andWhere('category.name_Category = :category', { category });
      }

      if (search) {
        query.andWhere('product.name_Product ILIKE :search OR product.description_Product ILIKE :search', { search: `%${search}%` });
      }

      const products = await query.getMany();
      const resp = await Promise.all(products.map(product => this.productMapper.fromPersistenceToDomain(product)));
      return Result.success<Product[]>(resp, 200);
    } catch (e) {
      return Result.fail(null, 500, e.message);
    }
  }

  async saveProductAggregate(product: Product): Promise<Result<Product>> {
    try {
      const newProduct = await this.productMapper.fromDomainToPersistence(product);
      console.log(newProduct.product_Categories);
      await this.save(newProduct);
      return Result.success<Product>(product, 200);
    } catch (error) {
      return Result.fail<Product>(new Error(error.message), error.code, error.message);
    }
  }
}
