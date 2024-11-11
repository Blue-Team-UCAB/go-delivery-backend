import { ValueObject } from '../../../common/domain/value-object';
import { InvalidProductIdException } from '../exceptions/invalid-product-id.exception';

export class ProductId implements ValueObject<ProductId> {
  private readonly _id: string;

  constructor(id: string) {
    const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
    if (!regex.test(id)) throw new InvalidProductIdException(`ID ${id} is not valid`);
    this._id = id;
  }

  equals(obj: ProductId): boolean {
    return this._id === obj._id;
  }

  get Id(): string {
    return this._id;
  }

  static create(id: string): ProductId {
    return new ProductId(id);
  }
}
