import { IPaymentRepository } from 'src/payment/domain/repositories/payment-repository.interface';
import { PaymentORMEntity as PaymentORM } from '../model/orm-payment.model';
import { DataSource, Repository } from 'typeorm';
import { Payment } from 'src/payment/domain/payment';
import { Result } from 'src/common/domain/result-handler/result';
import { PaymentMapper } from '../mappers/payment.mapper';

export class PaymentRepository extends Repository<PaymentORM> implements IPaymentRepository {
  private readonly paymentMapper: PaymentMapper;

  constructor(dataSource: DataSource) {
    super(PaymentORM, dataSource.createEntityManager());
    this.paymentMapper = new PaymentMapper();
  }

  async savePayment(payment: Payment): Promise<Result<Payment>> {
    try {
      const paymentORM = await this.paymentMapper.fromDomainToPersistence(payment);
      await this.save(paymentORM);
      return Result.success(payment, 200);
    } catch (error) {
      return Result.fail<Payment>(null, 500, 'Internal server error');
    }
  }
}
