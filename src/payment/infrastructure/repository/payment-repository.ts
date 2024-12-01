import { IPaymentRepository } from 'src/payment/domain/repositories/payment-repository.interface';
import { PaymentORMEntity as PaymentORM } from '../model/orm-payment.model';
import { DataSource, Repository } from 'typeorm';
import { Payment } from 'src/payment/domain/payment';
import { Result } from 'src/common/domain/result-handler/result';

export class PaymentRepository extends Repository<PaymentORM> implements IPaymentRepository {
  constructor(dataSource: DataSource) {
    super(PaymentORM, dataSource.createEntityManager());
  }
  async savePayment(payment: Payment): Promise<Result<Payment>> {
    return Result.fail(null, 500, 'Method not implemented');
  }
}
