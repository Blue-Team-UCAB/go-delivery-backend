import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidCostumerPhoneException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
