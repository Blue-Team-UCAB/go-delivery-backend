import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidDiscountStateException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
