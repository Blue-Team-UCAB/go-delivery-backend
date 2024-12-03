import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidOrderCourierPhoneException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
