import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidOrderStateException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
