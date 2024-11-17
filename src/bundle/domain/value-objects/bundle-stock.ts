import { ValueObject } from '../../../common/domain/value-object';
import { InvalidBundleStockException } from '../exceptions/invalid-bundle-stock.exception';

export class BundleStock implements ValueObject<BundleStock> {
  private readonly _stock: number;

  constructor(stock: number) {
    if (stock < 0) throw new InvalidBundleStockException(`Stock ${stock} is not valid`);
    this._stock = stock;
  }

  equals(obj: BundleStock): boolean {
    return this._stock === obj._stock;
  }

  get Stock(): number {
    return this._stock;
  }

  static create(stock: number): BundleStock {
    return new BundleStock(stock);
  }
}
