import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidProductException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
