import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidCostumerException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
