import { DomainEvent } from 'src/common/domain/domain-event';
import { PaymentId } from '../value-objects/payment-Id';
import { PaymentName } from '../value-objects/payment-name';
import { PaymentDate } from '../value-objects/payment-date';
import { PaymentAmount } from '../value-objects/payment-amount';
import { PaymentReference } from '../value-objects/payment-reference';
import { CostumerId } from 'src/costumer/domain/value-objects/costumer-id';

export const PAYMENT_CREATED_EVENT = 'PaymentCreatedEvent';

export class PaymentCreatedEvent extends DomainEvent {
  protected constructor(
    public id: PaymentId,
    public name: PaymentName,
    public date: PaymentDate,
    public amount: PaymentAmount,
    public reference: PaymentReference,
    public costumerId: CostumerId,
  ) {
    super();
  }

  static create(id: PaymentId, name: PaymentName, date: PaymentDate, amount: PaymentAmount, reference: PaymentReference, costumerId: CostumerId): PaymentCreatedEvent {
    return new PaymentCreatedEvent(id, name, date, amount, reference, costumerId);
  }
}
