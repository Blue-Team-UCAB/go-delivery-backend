import { AggregateRoot } from 'src/common/domain/aggregate-root';
import { PaymentId } from './value-objects/payment-Id';
import { PaymentName } from './value-objects/payment-name';
import { PaymentDate } from './value-objects/payment-date';
import { PaymentAmount } from './value-objects/payment-amount';
import { PaymentReference } from './value-objects/payment-reference';
import { InvalidPaymentException } from './exceptions/invalid-payment.exception';
import { DomainEvent } from 'src/common/domain/domain-event';
import { PaymentCreatedEvent } from './events/payment-created';
import { CustomerId } from 'src/customer/domain/value-objects/customer-id';

export class Payment extends AggregateRoot<PaymentId> {
  private name: PaymentName;
  private date: PaymentDate;
  private amount: PaymentAmount;
  private reference: PaymentReference;
  private customerId: CustomerId;

  get Name(): PaymentName {
    return this.name;
  }

  get Date(): PaymentDate {
    return this.date;
  }

  get Amount(): PaymentAmount {
    return this.amount;
  }

  get Reference(): PaymentReference {
    return this.reference;
  }

  get CustomerId(): CustomerId {
    return this.customerId;
  }

  constructor(id: PaymentId, name: PaymentName, date: PaymentDate, amount: PaymentAmount, reference: PaymentReference, customerId: CustomerId) {
    const paymentCreate = PaymentCreatedEvent.create(id, name, date, amount, reference, customerId);
    super(id, paymentCreate);
  }

  protected when(event: DomainEvent): void {
    if (event instanceof PaymentCreatedEvent) {
      this.name = event.name;
      this.date = event.date;
      this.amount = event.amount;
      this.reference = event.reference;
      this.customerId = event.customerId;
    }
  }
  protected checkValidState(): void {
    if (!this.name || !this.date || !this.amount || !this.reference) {
      throw new InvalidPaymentException('Payment is invalid');
    }
  }
}
