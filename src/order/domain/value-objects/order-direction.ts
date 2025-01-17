import { ValueObject } from '../../../common/domain/value-object';
import { InvalidOrderDirectionException } from '../exceptions/invalid-order-direction.exception';

export class OrderDirection implements ValueObject<OrderDirection> {
  private readonly _direction: string;
  private readonly _latitude: number;
  private readonly _longitude: number;

  constructor(direction: string, latitude: number, longitude: number) {
    if (!this.isValidDirection(direction)) {
      throw new InvalidOrderDirectionException(`Direction ${direction} is not valid`);
    }
    if (!this.isValidCoordinate(latitude, longitude)) {
      throw new InvalidOrderDirectionException(`Coordinates (${latitude}, ${longitude}) are not valid`);
    }
    this._direction = direction;
    this._latitude = latitude;
    this._longitude = longitude;
  }

  equals(obj: OrderDirection): boolean {
    return this._direction === obj._direction && this._latitude === obj._latitude && this._longitude === obj._longitude;
  }

  get Direction(): string {
    return this._direction;
  }

  get Latitude(): number {
    return this._latitude;
  }

  get Longitude(): number {
    return this._longitude;
  }

  private isValidDirection(direction: string): boolean {
    return direction.length >= 3;
  }

  private isValidCoordinate(latitude: number, longitude: number): boolean {
    return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
  }

  static create(direction: string, latitude: number, longitude: number): OrderDirection {
    return new OrderDirection(direction, latitude, longitude);
  }
}
