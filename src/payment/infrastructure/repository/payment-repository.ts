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

  async getPayments(idCustomer: string): Promise<Result<Payment[]>> {
    try {
      const payment = await this.createQueryBuilder('payment')
        .select(['payment.id_Payment', 'payment.name_Payment', 'payment.date_Payment', 'payment.amount_Payment', 'payment.reference_Payment', 'costumer.id_Costumer'])
        .leftJoin('payment.costumer', 'costumer')
        .where('costumer.id_Costumer = :idCustomer', { idCustomer })
        .getMany();

      const payments = await Promise.all(
        payment.map(async payment => {
          return await this.paymentMapper.fromPersistenceToDomain(payment);
        }),
      );

      return Result.success<Payment[]>(payments, 200);
    } catch (error) {
      console.log(error);
      return Result.fail<Payment[]>(null, 500, 'Internal server error');
    }
  }
}
