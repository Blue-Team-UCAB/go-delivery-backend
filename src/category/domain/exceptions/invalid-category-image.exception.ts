import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidCategoryImageException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
