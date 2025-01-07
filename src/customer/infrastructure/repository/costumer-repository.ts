import { ICustomerRepository } from '../../domain/repositories/customer-repository.interface';
import { CustomerORMEntity as CustomerORM } from '../model/orm-customer.entity';
import { DataSource, Repository } from 'typeorm';
import { Result } from '../../../common/domain/result-handler/result';
import { Customer } from '../../domain/customer';
import { CustomerMapper } from '../mapper/customer.mapper';

export class CustomerRepository extends Repository<CustomerORM> implements ICustomerRepository {
  private readonly CustomerMapper: CustomerMapper;

  constructor(dataSource: DataSource) {
    super(CustomerORM, dataSource.createEntityManager());
    this.CustomerMapper = new CustomerMapper();
  }

  async findById(id: string): Promise<Result<Customer>> {
    try {
      const CustomerORM = await this.createQueryBuilder('Customer')
        .select([
          'Customer.id_Costumer',
          'Customer.name_Costumer',
          'Customer.phone_Costumer',
          'Customer.image_Costumer',
          'wallet.id_Wallet',
          'wallet.amount_Wallet',
          'wallet.currency_Wallet',
          'direction.id_Direction',
          'direction.direction_Direction',
          'direction.latitude_Direction',
          'direction.longuitud_Direction',
          'direction.name_Direction',
        ])
        .leftJoin('Customer.wallet', 'wallet')
        .leftJoin('Customer.direction', 'direction')
        .where('Customer.id_Costumer = :id', { id })
        .getOne();

      if (!CustomerORM) {
        return Result.fail<Customer>(null, 404, 'Customer not found');
      }
      const Customer = await this.CustomerMapper.fromPersistenceToDomain(CustomerORM);
      return Result.success<Customer>(Customer, 200);
    } catch (e) {
      return Result.fail(null, 500, e.message);
    }
  }

  async saveCustomer(Customer: Customer): Promise<Result<Customer>> {
    try {
      const CustomerORM = await this.CustomerMapper.fromDomainToPersistence(Customer);
      await this.save(CustomerORM);
      return Result.success<Customer>(Customer, 201);
    } catch (e) {
      return Result.fail(new Error(e.message), 500, e.message);
    }
  }
}
