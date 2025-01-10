import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidDiscountIdException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
