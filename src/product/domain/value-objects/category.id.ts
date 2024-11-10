import { ValueObject } from '../../../common/domain/value-object';
import { InvalidCategoryIdException } from '../exceptions/invalid-category-id.exception';

export class CategoryId implements ValueObject<CategoryId> {
  private readonly _id: string;

  constructor(id: string) {
    const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
    if (!regex.test(id)) throw new InvalidCategoryIdException(`ID ${id} is not valid`);
    this._id = id;
  }

  equals(obj: CategoryId): boolean {
    return this._id === obj._id;
  }

  get Id(): string {
    return this._id;
  }

  static create(id: string): CategoryId {
    return new CategoryId(id);
  }
}
