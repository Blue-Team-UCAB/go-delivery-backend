import { DomainException } from '../../../common/domain/domain-exception';

export class InvalidOrderReceivedDateException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
