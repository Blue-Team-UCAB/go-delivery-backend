import { ValueObject } from 'src/common/domain/value-object';
import { InvalidCostumerIdException } from '../exceptions/invalid-costumer-id.exception';

export class CostumerId implements ValueObject<CostumerId> {
  private readonly _id: string;

  constructor(id: string) {
    const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
    if (!regex.test(id)) throw new InvalidCostumerIdException(`ID ${id} is not valid`);
    this._id = id;
  }

  equals(obj: CostumerId): boolean {
    return this._id === obj._id;
  }

  get Id(): string {
    return this._id;
  }

  static create(id: string): CostumerId {
    return new CostumerId(id);
  }
}
