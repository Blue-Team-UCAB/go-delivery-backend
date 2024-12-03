import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidOrderSubtotalAmountException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
