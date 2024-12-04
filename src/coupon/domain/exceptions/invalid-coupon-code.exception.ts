import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidCouponCodeException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
