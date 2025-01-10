import { IMapper } from 'src/common/application/mapper/mapper.interface';
import { PaymentORMEntity } from '../model/orm-payment.model';
import { Payment } from '../../domain/payment';
import { CustomerORMEntity } from 'src/customer/infrastructure/model/orm-customer.entity';
import { PaymentId } from 'src/payment/domain/value-objects/payment-Id';
import { PaymentName } from 'src/payment/domain/value-objects/payment-name';
import { PaymentDate } from 'src/payment/domain/value-objects/payment-date';
import { PaymentAmount } from 'src/payment/domain/value-objects/payment-amount';
import { PaymentReference } from 'src/payment/domain/value-objects/payment-reference';
import { CustomerId } from 'src/customer/domain/value-objects/customer-id';

export class PaymentMapper implements IMapper<Payment, PaymentORMEntity> {
  async fromDomainToPersistence(domain: Payment): Promise<PaymentORMEntity> {
    const paymentORM = new PaymentORMEntity();
    paymentORM.id_Payment = domain.Id.Id;
    paymentORM.name_Payment = domain.Name.Name;
    paymentORM.date_Payment = domain.Date.Date;
    paymentORM.amount_Payment = domain.Amount.Amount;
    paymentORM.reference_Payment = domain.Reference.Reference;
    paymentORM.costumer = { id_Costumer: domain.CustomerId.Id } as CustomerORMEntity;
    return paymentORM;
  }

  async fromPersistenceToDomain(persistence: PaymentORMEntity): Promise<Payment> {
    return new Payment(
      PaymentId.create(persistence.id_Payment),
      PaymentName.create(persistence.name_Payment),
      PaymentDate.create(persistence.date_Payment),
      PaymentAmount.create(persistence.amount_Payment),
      PaymentReference.create(persistence.reference_Payment),
      CustomerId.create(persistence.costumer.id_Costumer),
    );
  }
}
