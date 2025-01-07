import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidOrderCourierImageException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
