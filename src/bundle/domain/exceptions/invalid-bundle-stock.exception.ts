import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidBundleStockException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
