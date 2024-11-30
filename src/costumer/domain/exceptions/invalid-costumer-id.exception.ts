import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidCostumerIdException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
