import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidDiscountExpirationDateException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
