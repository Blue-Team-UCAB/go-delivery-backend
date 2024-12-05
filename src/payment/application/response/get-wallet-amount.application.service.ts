import { IApplicationService } from 'src/common/application/application-services/application-service.interface';
import { GetWalletAmountResponseDto } from '../dto/response/get-wallet-amount.response.dto';
import { GetWalletAmountEntryDto } from '../dto/entry/get-wallet-amount.entry.dto';
import { IWalletRepository } from 'src/customer/domain/repositories/wallet-repository.interface';

import { Result } from 'src/common/domain/result-handler/result';
import { ICustomerRepository } from 'src/customer/domain/repositories/customer-repository.interface';

export class GetWalletAmountApplicationService implements IApplicationService<GetWalletAmountEntryDto, GetWalletAmountResponseDto> {
  constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly costumerRepository: ICustomerRepository,
  ) {}

  async execute(data: GetWalletAmountEntryDto): Promise<Result<GetWalletAmountResponseDto>> {
    const customer = await this.costumerRepository.findById(data.idCustomer);

    if (!customer.isSuccess) {
      return Result.fail<GetWalletAmountResponseDto>(null, 400, 'Customer not found');
    }

    const walletId = customer.Value.Wallet.Id.Id;

    const wallet = await this.walletRepository.findById(walletId);

    if (!wallet.isSuccess) {
      return Result.fail<GetWalletAmountResponseDto>(null, 400, 'Wallet not found');
    }

    const res: GetWalletAmountResponseDto = {
      amount: wallet.Value.Amount.Amount,
      currency: wallet.Value.Currency.Currency,
    };

    return Result.success<GetWalletAmountResponseDto>(res, 200);
  }
}
