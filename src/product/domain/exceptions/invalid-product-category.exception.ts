import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidProductCategoryException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
