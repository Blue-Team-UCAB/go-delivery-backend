import { ValueObject } from '../../../common/domain/value-object';
import { InvalidProductMeasurementException } from '../exceptions/invalid-product-measurement.exception';

export class ProductMeasurement implements ValueObject<ProductMeasurement> {
  private readonly _measurement: string;

  constructor(measurement: string) {
    if (!this.isValidMeasurement(measurement)) throw new InvalidProductMeasurementException(`Measurement ${measurement} is not valid`);
    this._measurement = measurement.toLowerCase();
  }

  equals(obj: ProductMeasurement): boolean {
    return this._measurement === obj._measurement;
  }

  get Measurement(): string {
    return this._measurement;
  }

  private isValidMeasurement(measurement: string): boolean {
    const validMeasurements = ['kg', 'gr', 'mg', 'ml', 'lt', 'cm3'];
    return validMeasurements.includes(measurement.toLowerCase());
  }

  static create(measurement: string): ProductMeasurement {
    return new ProductMeasurement(measurement);
  }
}
