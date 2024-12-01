import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidProductMeasurementException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
