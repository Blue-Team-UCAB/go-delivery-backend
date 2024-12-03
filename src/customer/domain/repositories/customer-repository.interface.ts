import { Result } from '../../../common/domain/result-handler/result';
import { Customer } from '../customer';

export interface ICustomerRepository {
  findById(id: string): Promise<Result<Customer>>;
  saveCustomer(Customer: Customer): Promise<Result<Customer>>;
}
