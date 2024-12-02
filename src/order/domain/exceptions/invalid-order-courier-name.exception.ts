import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidOrderCourierNameException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
