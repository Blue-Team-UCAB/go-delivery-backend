import { ValueObject } from 'src/common/domain/value-object';
import { InvalidDirectionLongitudeException } from '../exceptions/invalid-direction-longuitude.exception';

export class DirectionLongitud implements ValueObject<DirectionLongitud> {
  private readonly _longitud: string;

  constructor(longitud: string) {
    if (longitud.length < 1) {
      throw new InvalidDirectionLongitudeException('Longitude is not valid');
    }
    this._longitud = longitud;
  }

  equals(obj: DirectionLongitud): boolean {
    return this._longitud === obj._longitud;
  }

  get Longitud(): string {
    return this._longitud;
  }

  static create(lon: string): DirectionLongitud {
    return new DirectionLongitud(lon);
  }
}
