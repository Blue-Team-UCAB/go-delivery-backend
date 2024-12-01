import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidProductCategoryNameException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
