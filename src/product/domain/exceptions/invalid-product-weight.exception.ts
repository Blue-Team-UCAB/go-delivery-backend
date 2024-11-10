import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidProductWeightException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
