import { ValueObject } from '../../../common/domain/value-object';
import { InvalidDirectionNameException } from '../exceptions/invalid-direction-name.exception';

export class DirectionName implements ValueObject<DirectionName> {
  private readonly _name: string;

  constructor(name: string) {
    if (name.length < 3) throw new InvalidDirectionNameException(`Name ${name} is not valid`);
    this._name = name;
  }

  equals(obj: DirectionName): boolean {
    return this._name === obj._name;
  }

  get Name(): string {
    return this._name;
  }

  static create(name: string): DirectionName {
    return new DirectionName(name);
  }
}
