export class InvalidProductMeasurementException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
