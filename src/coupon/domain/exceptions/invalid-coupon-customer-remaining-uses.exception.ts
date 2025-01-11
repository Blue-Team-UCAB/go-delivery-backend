import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidCouponCustomerRemainingUsesException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
