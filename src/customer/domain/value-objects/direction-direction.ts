import { ValueObject } from 'src/common/domain/value-object';
import { InvalidDirectionDescriptionException } from '../exceptions/invalid-direction-direction.exception';

export class DirectionDescription implements ValueObject<DirectionDescription> {
  private readonly _description: string;

  constructor(description: string) {
    if (description.length < 5) {
      throw new InvalidDirectionDescriptionException(`Direction ${description} is not valid`);
    }
    this._description = description;
  }

  equals(obj: DirectionDescription): boolean {
    return this._description === obj._description;
  }

  get Description(): string {
    return this._description;
  }

  static create(dir: string): DirectionDescription {
    return new DirectionDescription(dir);
  }
}
