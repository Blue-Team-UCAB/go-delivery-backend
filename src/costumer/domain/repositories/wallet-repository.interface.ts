import { Result } from 'src/common/domain/result-handler/result';
import { Wallet } from '../entities/wallet';

export interface IWalletRepository {
  findById(id: string): Promise<Result<Wallet>>;
  saveWallet(wallet: Wallet): Promise<Result<Wallet>>;
}
