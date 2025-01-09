import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidDiscountException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
