import { IMapper } from 'src/common/application/mapper/mapper.interface';
import { Costumer } from 'src/costumer/domain/costumer';
import { CostumerORMEntity } from '../model/orm-costumer.entity';
import { CostumerId } from 'src/costumer/domain/value-objects/costumer-id';
import { CostumerPhone } from 'src/costumer/domain/value-objects/costumer-phone';
import { CostumerName } from 'src/costumer/domain/value-objects/costumer-name';
import { WalletAmount } from 'src/costumer/domain/value-objects/wallet-amount';
import { WalletCurrency } from 'src/costumer/domain/value-objects/wallet-currency';
import { WalletId } from 'src/costumer/domain/value-objects/wallet-id';
import { WalletORMEntity } from '../model/orm-wallet.entity';

export class CostumerMapper implements IMapper<Costumer, CostumerORMEntity> {
  async fromDomainToPersistence(domain: Costumer): Promise<CostumerORMEntity> {
    const costumerORM = new CostumerORMEntity();
    costumerORM.id_Costumer = domain.Id.Id;
    costumerORM.name_Costumer = domain.Name.Name;
    costumerORM.phone_Costumer = domain.Phone.Phone;
    costumerORM.wallet = { id_Wallet: domain.Wallet.Id.Id } as WalletORMEntity;
    return costumerORM;
  }
  async fromPersistenceToDomain(persistence: CostumerORMEntity): Promise<Costumer> {
    return new Costumer(
      CostumerId.create(persistence.id_Costumer),
      CostumerName.create(persistence.name_Costumer),
      CostumerPhone.create(persistence.phone_Costumer),
      WalletId.create(persistence.wallet.id_Wallet),
      WalletAmount.create(persistence.wallet.amount_Wallet),
      WalletCurrency.create(persistence.wallet.currency_Wallet),
    );
  }
}
