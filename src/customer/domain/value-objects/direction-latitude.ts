import { ValueObject } from 'src/common/domain/value-object';
import { InvalidDirectionLatitudeException } from '../exceptions/invalid-direction-latitude.exception';

export class DirectionLatitude implements ValueObject<DirectionLatitude> {
  private readonly _latitude: string;

  constructor(latitude: string) {
    const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
    if (!regex.test(latitude)) throw new InvalidDirectionLatitudeException(`Latitude ${latitude} is not valid`);
    this._latitude = latitude;
  }

  equals(obj: DirectionLatitude): boolean {
    return this._latitude === obj._latitude;
  }

  get Latitude(): string {
    return this._latitude;
  }

  static create(lat: string): DirectionLatitude {
    return new DirectionLatitude(lat);
  }
}
