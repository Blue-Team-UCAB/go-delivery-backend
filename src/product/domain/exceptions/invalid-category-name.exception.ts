import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidCategoryNameException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
