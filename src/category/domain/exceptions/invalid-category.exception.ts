import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidCategoryException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
