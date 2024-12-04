import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidCouponException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
