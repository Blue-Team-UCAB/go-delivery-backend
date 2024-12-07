import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidDirectionIdException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
