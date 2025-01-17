import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidDiscountPercentageException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
