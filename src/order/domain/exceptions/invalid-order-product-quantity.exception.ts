import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidOrderProductQuantityException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
