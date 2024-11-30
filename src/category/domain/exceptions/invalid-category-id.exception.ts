import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidCategoryIdException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
