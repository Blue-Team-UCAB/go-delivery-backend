import { DomainException } from 'src/common/domain/domain-exception';

export class DirectionNotFound extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
