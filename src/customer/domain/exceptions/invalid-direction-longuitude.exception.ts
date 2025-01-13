import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidDirectionLongitudeException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
