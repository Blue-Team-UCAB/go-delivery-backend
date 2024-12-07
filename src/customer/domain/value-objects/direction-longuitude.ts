import { ValueObject } from 'src/common/domain/value-object';
import { InvalidDirectionLonguitudeException } from '../exceptions/invalid-direction-longuitude.exception';

export class DirectionLonguitud implements ValueObject<DirectionLonguitud> {
  private readonly _longuitud: string;

  constructor(longuitud: string) {
    const regex = new RegExp('^-?(180(.0{1,6})?|((1[0-7][0-9]|[1-9]?[0-9])(.d{1,6})?))$');
    if (!regex.test(longuitud)) throw new InvalidDirectionLonguitudeException(`Longuitud ${longuitud} is not valid`);
    this._longuitud = longuitud;
  }

  equals(obj: DirectionLonguitud): boolean {
    return this._longuitud === obj._longuitud;
  }

  get Longuitud(): string {
    return this._longuitud;
  }

  static create(lon: string): DirectionLonguitud {
    return new DirectionLonguitud(lon);
  }
}
