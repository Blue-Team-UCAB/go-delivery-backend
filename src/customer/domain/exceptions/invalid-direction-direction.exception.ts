import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidDirectionDescriptionException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
