import { Result } from 'src/common/domain/result-handler/result';
import { Payment } from '../payment';

export interface IPaymentRepository {
  savePayment(payment: Payment): Promise<Result<Payment>>;
  getPayments(idCustomer: string): Promise<Result<Payment[]>>;
}
