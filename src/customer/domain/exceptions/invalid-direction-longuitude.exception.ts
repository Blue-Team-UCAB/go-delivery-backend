import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidDirectionLonguitudeException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
