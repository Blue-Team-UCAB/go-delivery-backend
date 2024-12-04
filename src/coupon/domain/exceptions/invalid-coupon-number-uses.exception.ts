import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidCouponNumberUsesException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
