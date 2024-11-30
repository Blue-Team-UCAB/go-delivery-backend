import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidCostumerNameException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
