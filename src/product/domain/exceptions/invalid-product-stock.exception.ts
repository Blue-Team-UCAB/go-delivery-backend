import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidProductStockException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
