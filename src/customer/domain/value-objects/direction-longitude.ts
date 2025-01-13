import { ValueObject } from 'src/common/domain/value-object';
import { InvalidDirectionLongitudeException } from '../exceptions/invalid-direction-longuitude.exception';

export class DirectionLongitud implements ValueObject<DirectionLongitud> {
  private readonly _longitud: string;

  constructor(longitud: string) {
    const regex = new RegExp('^-?([0-9]{1,2}|1[0-7][0-9]|180)(.[0-9]{1,10})$');
    if (!regex.test(longitud)) throw new InvalidDirectionLongitudeException(`Longitud ${longitud} is not valid`);
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
