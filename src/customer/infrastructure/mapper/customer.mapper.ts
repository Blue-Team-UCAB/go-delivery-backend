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
import { Direction } from 'src/customer/domain/entities/direction';
import { DirectionId } from 'src/customer/domain/value-objects/direction-id';
import { DirectionDescription } from 'src/customer/domain/value-objects/direction-direction';
import { DirectionLatitude } from 'src/customer/domain/value-objects/direction-latitude';
import { DirectionLongitud } from 'src/customer/domain/value-objects/direction-longitude';
import { DirectionORMEntity } from '../model/orm-direction.entity';
import { DirectionName } from 'src/customer/domain/value-objects/direction-name';
import { CustomerImage } from 'src/customer/domain/value-objects/customer-image';

export class CustomerMapper implements IMapper<Customer, CustomerORMEntity> {
  async fromDomainToPersistence(domain: Customer): Promise<CustomerORMEntity> {
    const CustomerORM = new CustomerORMEntity();
    CustomerORM.id_Costumer = domain.Id.Id;
    CustomerORM.name_Costumer = domain.Name.Name;
    CustomerORM.phone_Costumer = domain.Phone.Phone;
    CustomerORM.wallet = { id_Wallet: domain.Wallet.Id.Id } as WalletORMEntity;

    if (domain.Direction) {
      CustomerORM.direction = domain.Direction.map(direction => {
        const directionORM = new DirectionORMEntity();
        directionORM.id_Direction = direction.Id.Id;
        directionORM.direction_Direction = direction.Description.Description;
        directionORM.latitude_Direction = direction.Latitude.Latitude;
        directionORM.longuitud_Direction = direction.Longitud.Longitud;
        directionORM.name_Direction = direction.Name.Name;
        return directionORM;
      });
    }

    if (domain.Image) {
      CustomerORM.image_Costumer = domain.Image.Url;
    }

    return CustomerORM;
  }

  async fromPersistenceToDomain(persistence: CustomerORMEntity): Promise<Customer> {
    let directions: Direction[] = [];
    directions = await Promise.all(
      persistence.direction.map(async direction => {
        return new Direction(
          DirectionId.create(direction.id_Direction),
          DirectionDescription.create(direction.direction_Direction),
          DirectionLatitude.create(direction.latitude_Direction),
          DirectionLongitud.create(direction.longuitud_Direction),
          DirectionName.create(direction.name_Direction),
        );
      }),
    );

    let image: CustomerImage = null;
    if (persistence.image_Costumer) {
      image = new CustomerImage(persistence.image_Costumer);
    }

    return new Customer(
      CustomerId.create(persistence.id_Costumer),
      CustomerName.create(persistence.name_Costumer),
      CustomerPhone.create(persistence.phone_Costumer),
      WalletId.create(persistence.wallet.id_Wallet),
      WalletAmount.create(persistence.wallet.amount_Wallet),
      WalletCurrency.create(persistence.wallet.currency_Wallet),
      directions,
      image,
    );
  }
}
