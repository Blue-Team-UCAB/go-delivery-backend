import { Result } from 'src/common/domain/result-handler/result';
import { Product } from 'src/product/domain/product';
import { IProductRepository } from 'src/product/domain/repositories/product-repository.interface';

export class ProductRepositoryMock implements IProductRepository {
  private products: Product[] = [];

  async findProductById(id: string): Promise<Result<Product>> {
    try {
      const response = this.products.find(product => product.Id.Id === id);
      if (!response) {
        return Result.fail<Product>(null, 404, 'Product not found');
      }
      return Result.success<Product>(response, 200);
    } catch (error) {
      return Result.fail<Product>(null, 500, error.message || 'Error simulado en la base de datos');
    }
  }

  async findAllProducts(page: number, perpage: number, category?: string[], name?: string, price?: string, popular?: string, discount?: string): Promise<Result<Product[]>> {
    try {
      const response = this.products;
      if (!response) {
        return Result.fail<Product[]>(null, 404, 'Products not found');
      }
      return Result.success<Product[]>(response, 200);
    } catch (error) {
      return Result.fail<Product[]>(null, 500, error.message || 'Error simulado en la base de datos');
    }
  }

  async saveProductAggregate(product: Product): Promise<Result<Product>> {
    try {
      this.products.push(product);
      return Result.success<Product>(product, 201);
    } catch (error) {
      return Result.fail<Product>(null, 500, error.message || 'Error simulado en la base de datos');
    }
  }
}
