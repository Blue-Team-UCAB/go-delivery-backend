import { IMapper } from 'src/common/application/mapper/mapper.interface';
import { Wallet } from 'src/customer/domain/entities/wallet';
import { WalletORMEntity } from '../model/orm-wallet.entity';
import { WalletId } from 'src/customer/domain/value-objects/wallet-id';
import { WalletAmount } from 'src/customer/domain/value-objects/wallet-amount';
import { WalletCurrency } from 'src/customer/domain/value-objects/wallet-currency';

export class WalletMapper implements IMapper<Wallet, WalletORMEntity> {
  async fromDomainToPersistence(domain: Wallet): Promise<WalletORMEntity> {
    const walletORM = new WalletORMEntity();
    walletORM.id_Wallet = domain.Id.Id;
    walletORM.amount_Wallet = domain.Amount.Amount;
    walletORM.currency_Wallet = domain.Currency.Currency;

    return walletORM;
  }
  async fromPersistenceToDomain(persistence: WalletORMEntity): Promise<Wallet> {
    return new Wallet(WalletId.create(persistence.id_Wallet), WalletAmount.create(persistence.amount_Wallet), WalletCurrency.create(persistence.currency_Wallet));
  }
}
