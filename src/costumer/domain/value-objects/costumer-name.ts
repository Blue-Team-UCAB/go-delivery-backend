import { ValueObject } from '../../../common/domain/value-object';
import { InvalidCostumerNameException } from '../exceptions/invalid-costumer-name.exception';

export class CostumerName implements ValueObject<CostumerName> {
  private readonly _name: string;

  constructor(name: string) {
    if (name.length < 3) throw new InvalidCostumerNameException(`Name ${name} is not valid`);
    this._name = name;
  }

  equals(obj: CostumerName): boolean {
    return this._name === obj._name;
  }

  get Name(): string {
    return this._name;
  }

  static create(name: string): CostumerName {
    return new CostumerName(name);
  }
}
