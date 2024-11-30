import { Result } from 'src/common/domain/result-handler/result';
import { IApplicationService } from '../../../common/application/application-services/application-service.interface';
import { ISignUpEntryApplication } from '../dto/entry/sign-up-entry.application.dto';
import { ISignUpResponseApplication } from '../dto/response/sing-up-response.application.dto';
import { IUserRepository } from '../repository/user-repository.interface';
import { IdGenerator } from '../../../common/application/id-generator/id-generator.interface';
import { User } from '../model/user-model';
import { ICrypto } from 'src/common/application/crypto/crypto';
import { IJwtGenerator } from '../../../common/application/jwt-generator/jwt-generator.interface';
import { ICostumerRepository } from 'src/costumer/domain/repositories/costumer-repository.interface';
import { Costumer } from 'src/costumer/domain/costumer';
import { CostumerId } from 'src/costumer/domain/value-objects/costumer-id';
import { CostumerName } from 'src/costumer/domain/value-objects/costumer-name';
import { CostumerPhone } from 'src/costumer/domain/value-objects/costumer-phone';
import { WalletId } from 'src/costumer/domain/value-objects/wallet-id';
import { WalletAmount } from 'src/costumer/domain/value-objects/wallet-amount';
import { WalletCurrency } from 'src/costumer/domain/value-objects/wallet-currency';
import { IWalletRepository } from 'src/costumer/domain/repositories/wallet-repository.interface';

export class AuthCreateUserApplicationService implements IApplicationService<ISignUpEntryApplication, ISignUpResponseApplication> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly idGenerator: IdGenerator<string>,
    private readonly passwordHasher: ICrypto,
    private readonly jwtGenerator: IJwtGenerator,
    private readonly costumerRepository: ICostumerRepository,
    private readonly walletRepository: IWalletRepository,
  ) {}

  async execute(data: ISignUpEntryApplication): Promise<Result<ISignUpResponseApplication>> {
    const emailLower = data.email.toLowerCase();

    const findUser = await this.userRepository.getByEmail(emailLower);
    if (findUser.getAssigned() === true) {
      return Result.fail<ISignUpResponseApplication>(null, 400, 'Email already in use');
    }

    const userId = await this.idGenerator.generateId();
    const hashpassword = await this.passwordHasher.encrypt(data.password);

    const constumerId = CostumerId.create(await this.idGenerator.generateId());
    const walletId = WalletId.create(await this.idGenerator.generateId());

    const costumer = new Costumer(constumerId, CostumerName.create(data.name), CostumerPhone.create(data.phone), walletId, WalletAmount.create(0), WalletCurrency.create('USD'));

    const walletCreate = await this.walletRepository.saveWallet(costumer.Wallet);

    const costumerCreate = await this.costumerRepository.saveCostumer(costumer);

    const user = {
      idUser: userId,
      emailUser: emailLower,
      passwordUser: hashpassword,
      roleUser: 'CLIENT',
      costumerId: costumerCreate.Value.Id.Id,
    } satisfies User;

    const createUser = await this.userRepository.saveUser(user);

    if (!createUser.isSuccess()) {
      return Result.fail<ISignUpResponseApplication>(createUser.Error, createUser.StatusCode, createUser.Message);
    }

    const response: ISignUpResponseApplication = {
      name: costumerCreate.Value.Name.Name,
      email: user.emailUser,
      token: this.jwtGenerator.generateJwt(userId),
    };

    return Result.success<ISignUpResponseApplication>(response, 200);
  }
}
