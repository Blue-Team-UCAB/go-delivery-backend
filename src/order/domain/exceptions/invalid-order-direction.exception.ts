import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidOrderDirectionException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
