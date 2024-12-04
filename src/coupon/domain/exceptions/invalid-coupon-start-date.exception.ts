import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidCouponStartDateException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
