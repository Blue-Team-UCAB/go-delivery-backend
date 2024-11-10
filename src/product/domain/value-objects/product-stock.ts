import { ValueObject } from 'src/common/domain/value-object';
import { InvalidProductStockException } from '../exceptions/invalid-product-stock.exception';

export class ProductStock implements ValueObject<ProductStock> {
  private readonly _stock: number;

  constructor(stock: number) {
    if (stock < 0) throw new InvalidProductStockException(`Stock ${stock} is not valid`);
    this._stock = stock;
  }

  equals(obj: ProductStock): boolean {
    return this._stock === obj._stock;
  }

  get Stock(): number {
    return this._stock;
  }

  static create(stock: number): ProductStock {
    return new ProductStock(stock);
  }
}
