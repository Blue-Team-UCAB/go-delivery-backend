import { IMapper } from 'src/common/application/mapper/mapper.interface';
import { PaymentORMEntity } from '../model/orm-payment.model';
import { Payment } from '../../domain/payment';
import { PaymentId } from '../../domain/value-objects/payment-id';
import { PaymentName } from '../../domain/value-objects/payment-name';
import { PaymentDate } from '../../domain/value-objects/payment-date';
import { PaymentAmount } from '../../domain/value-objects/payment-amount';
import { PaymentReference } from '../../domain/value-objects/payment-reference';
import { CostumerId } from 'src/costumer/domain/value-objects/costumer-id';
import { CostumerORMEntity } from 'src/costumer/infrastructure/model/orm-costumer.entity';

export class PaymentMapper implements IMapper<Payment, PaymentORMEntity> {
  async fromDomainToPersistence(domain: Payment): Promise<PaymentORMEntity> {
    const paymentORM = new PaymentORMEntity();
    paymentORM.id_Payment = domain.Id.Id;
    paymentORM.name_Payment = domain.Name.Name;
    paymentORM.date_Payment = domain.Date.Date;
    paymentORM.amount_Payment = domain.Amount.Amount;
    paymentORM.reference_Payment = domain.Reference.Reference;
    paymentORM.costumer = { id_Costumer: domain.CostumerId.Id } as CostumerORMEntity;
    return paymentORM;
  }

  async fromPersistenceToDomain(persistence: PaymentORMEntity): Promise<Payment> {
    throw new Error('Method not implemented');
  }
}
