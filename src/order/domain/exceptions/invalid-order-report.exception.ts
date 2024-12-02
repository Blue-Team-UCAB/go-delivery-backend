import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidOrderReportException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
