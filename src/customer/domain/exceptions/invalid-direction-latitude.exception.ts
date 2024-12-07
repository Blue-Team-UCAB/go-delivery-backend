import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidDirectionLatitudeException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
