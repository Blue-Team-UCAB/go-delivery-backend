import { PaymentMethodORMEntity } from '../model/orm-payment-method';
import { DataSource, Repository } from 'typeorm';
import { Result } from 'src/common/domain/result-handler/result';

export class PaymentMethodRepository extends Repository<PaymentMethodORMEntity> {
  constructor(dataSource: DataSource) {
    super(PaymentMethodORMEntity, dataSource.createEntityManager());
  }

  async createPaymentMethod(paymentMethod: PaymentMethodORMEntity): Promise<Result<PaymentMethodORMEntity>> {
    try {
      const result = await this.save(paymentMethod);
      return Result.success<PaymentMethodORMEntity>(result, 200);
    } catch (error) {
      return Result.fail<PaymentMethodORMEntity>(error, 500, 'Error creating payment method');
    }
  }

  async updatePaymentMethod(id: string, status: boolean): Promise<Result<PaymentMethodORMEntity>> {
    try {
      const service = await this.findOne({ where: { id_PaymentMethod: id } });
      if (!service) {
        return Result.fail<PaymentMethodORMEntity>(null, 404, 'Payment method not found');
      }
      service.state_PaymentMethod = status;
      await this.save(service);
      return Result.success<PaymentMethodORMEntity>(service, 200);
    } catch (error) {
      return Result.fail<PaymentMethodORMEntity>(error, 500, 'Error updating payment method');
    }
  }

  async getPaymentMethods(): Promise<Result<PaymentMethodORMEntity[]>> {
    try {
      const paymentMethods = await this.find();
      return Result.success<PaymentMethodORMEntity[]>(paymentMethods, 200);
    } catch (error) {
      return Result.fail<PaymentMethodORMEntity[]>(null, 500, 'Error getting payment methods');
    }
  }

  async getOnlyActivePaymentMethods(): Promise<Result<PaymentMethodORMEntity[]>> {
    try {
      const paymentMethods = await this.find({ where: { state_PaymentMethod: true } });
      return Result.success<PaymentMethodORMEntity[]>(paymentMethods, 200);
    } catch (error) {
      return Result.fail<PaymentMethodORMEntity[]>(null, 500, 'Error getting payment methods');
    }
  }
}
