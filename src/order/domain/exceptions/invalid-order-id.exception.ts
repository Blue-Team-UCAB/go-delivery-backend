import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidOrderIdException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
