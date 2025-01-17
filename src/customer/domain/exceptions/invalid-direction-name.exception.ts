import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidDirectionNameException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
