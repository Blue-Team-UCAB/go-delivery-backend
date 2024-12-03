import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidOrderTotalAmountException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
