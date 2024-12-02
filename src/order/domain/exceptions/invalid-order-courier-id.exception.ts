import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidOrderCourierIdException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
