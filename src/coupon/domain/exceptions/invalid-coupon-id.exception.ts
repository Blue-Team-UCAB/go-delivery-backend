import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidCouponIdException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
