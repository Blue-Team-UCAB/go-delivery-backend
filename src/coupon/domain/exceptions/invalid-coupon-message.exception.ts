import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidCouponMessageException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
