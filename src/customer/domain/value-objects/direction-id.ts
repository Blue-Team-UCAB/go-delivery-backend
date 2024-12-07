import { ValueObject } from 'src/common/domain/value-object';
import { InvalidDirectionIdException } from '../exceptions/invalid-direction-id.exception';

export class DirectionId implements ValueObject<DirectionId> {
  private readonly _id: string;

  constructor(id: string) {
    const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
    if (!regex.test(id)) throw new InvalidDirectionIdException(`ID ${id} is not valid`);
    this._id = id;
  }

  equals(obj: DirectionId): boolean {
    return this._id === obj._id;
  }

  get Id(): string {
    return this._id;
  }

  static create(id: string): DirectionId {
    return new DirectionId(id);
  }
}
