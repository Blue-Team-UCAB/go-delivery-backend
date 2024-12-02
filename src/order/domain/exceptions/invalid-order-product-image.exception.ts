import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidOrderProductImageException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
