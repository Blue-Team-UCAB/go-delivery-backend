import { IMapper } from 'src/common/application/mapper/mapper.interface';
import { Customer } from 'src/customer/domain/customer';
import { CustomerORMEntity } from '../model/orm-customer.entity';
import { CustomerId } from 'src/customer/domain/value-objects/customer-id';
import { CustomerPhone } from 'src/customer/domain/value-objects/customer-phone';
import { CustomerName } from 'src/customer/domain/value-objects/customer-name';
import { WalletAmount } from 'src/customer/domain/value-objects/wallet-amount';
import { WalletCurrency } from 'src/customer/domain/value-objects/wallet-currency';
import { WalletId } from 'src/customer/domain/value-objects/wallet-id';
import { WalletORMEntity } from '../model/orm-wallet.entity';

export class CustomerMapper implements IMapper<Customer, CustomerORMEntity> {
  async fromDomainToPersistence(domain: Customer): Promise<CustomerORMEntity> {
    const CustomerORM = new CustomerORMEntity();
    CustomerORM.id_Costumer = domain.Id.Id;
    CustomerORM.name_Costumer = domain.Name.Name;
    CustomerORM.phone_Costumer = domain.Phone.Phone;
    CustomerORM.wallet = { id_Wallet: domain.Wallet.Id.Id } as WalletORMEntity;
    return CustomerORM;
  }
  async fromPersistenceToDomain(persistence: CustomerORMEntity): Promise<Customer> {
    return new Customer(
      CustomerId.create(persistence.id_Costumer),
      CustomerName.create(persistence.name_Costumer),
      CustomerPhone.create(persistence.phone_Costumer),
      WalletId.create(persistence.wallet.id_Wallet),
      WalletAmount.create(persistence.wallet.amount_Wallet),
      WalletCurrency.create(persistence.wallet.currency_Wallet),
    );
  }
}
