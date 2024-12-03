import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidOrderProductNameException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
