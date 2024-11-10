import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidProductIdException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
