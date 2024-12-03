import { Result } from 'src/common/domain/result-handler/result';
import { IApplicationService } from '../../../common/application/application-services/application-service.interface';
import { ISignInEntryApplication } from '../dto/entry/sign-in-entry.application.dto';
import { ISignUpResponseApplication } from '../dto/response/sing-up-response.application.dto';
import { IUserRepository } from '../repository/user-repository.interface';
import { ICrypto } from 'src/common/application/crypto/crypto';
import { IJwtGenerator } from '../../../common/application/jwt-generator/jwt-generator.interface';
import { ICustomerRepository } from 'src/customer/domain/repositories/customer-repository.interface';

export class AuthLoginUserApplicationService implements IApplicationService<ISignInEntryApplication, ISignUpResponseApplication> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: ICrypto,
    private readonly jwtGenerator: IJwtGenerator,
    private readonly costumerRepository: ICustomerRepository,
  ) {}

  async execute(data: ISignInEntryApplication): Promise<Result<ISignUpResponseApplication>> {
    const emailLower = data.email.toLowerCase();

    const findUser = await this.userRepository.getByEmail(emailLower);

    if (findUser.getAssigned() === false) {
      return Result.fail<ISignUpResponseApplication>(null, 400, 'User not found');
    }

    const passwordHash = await this.passwordHasher.compare(data.password, findUser.getValue().passwordUser);

    if (passwordHash === false) {
      return Result.fail<ISignUpResponseApplication>(null, 400, 'Invalid Credentials');
    }

    const costumer = await this.costumerRepository.findById(findUser.getValue().costumerId);

    if (!costumer.isSuccess()) {
      return Result.fail<ISignUpResponseApplication>(null, 500, 'Costumer not found');
    }

    const token = this.jwtGenerator.generateJwt(findUser.getValue().idUser);

    const response: ISignUpResponseApplication = {
      name: costumer.Value.Name.Name,
      email: findUser.getValue().emailUser,
      token: token,
    };

    return Result.success<ISignUpResponseApplication>(response, 200);
  }
}
