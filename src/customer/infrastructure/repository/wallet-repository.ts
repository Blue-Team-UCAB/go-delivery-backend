import { IWalletRepository } from 'src/customer/domain/repositories/wallet-repository.interface';
import { WalletORMEntity as WalletORM } from '../model/orm-wallet.entity';
import { DataSource, Repository } from 'typeorm';
import { Result } from 'src/common/domain/result-handler/result';
import { Wallet } from '../../domain/entities/wallet';
import { WalletMapper } from '../mapper/wallet.mapper';

export class WalletRepository extends Repository<WalletORM> implements IWalletRepository {
  private readonly walletMapper: WalletMapper;
  constructor(dataSource: DataSource) {
    super(WalletORM, dataSource.createEntityManager());
    this.walletMapper = new WalletMapper();
  }

  async findById(id: string): Promise<Result<Wallet>> {
    try {
      const walletORM = await this.createQueryBuilder('wallet').select(['wallet.id_Wallet', 'wallet.amount_Wallet', 'wallet.currency_Wallet']).where('wallet.id_Wallet = :id', { id }).getOne();
      if (!walletORM) {
        return Result.fail(null, 404, 'Wallet not found');
      }
      const wallet = await this.walletMapper.fromPersistenceToDomain(walletORM);
      return Result.success<Wallet>(wallet, 200);
    } catch (e) {
      return Result.fail(null, 500, e.message);
    }
  }

  async saveWallet(wallet: Wallet): Promise<Result<Wallet>> {
    try {
      const walletORM = await this.walletMapper.fromDomainToPersistence(wallet);
      await this.save(walletORM);
      return Result.success<Wallet>(wallet, 201);
    } catch (e) {
      return Result.fail(new Error(e.message), 500, e.message);
    }
  }
}
