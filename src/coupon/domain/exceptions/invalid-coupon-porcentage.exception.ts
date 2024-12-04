import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidCouponPorcentageException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
