import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidProductImageException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
