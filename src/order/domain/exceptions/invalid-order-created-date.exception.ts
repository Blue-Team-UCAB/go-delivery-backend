import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidOrderCreatedDateException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
