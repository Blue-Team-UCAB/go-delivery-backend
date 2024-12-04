import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidCouponExpirationDateException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
