import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidOrderException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
