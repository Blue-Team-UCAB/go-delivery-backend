import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidDiscountStartDateException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
