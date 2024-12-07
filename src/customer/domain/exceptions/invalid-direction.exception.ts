import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidDirectionException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
