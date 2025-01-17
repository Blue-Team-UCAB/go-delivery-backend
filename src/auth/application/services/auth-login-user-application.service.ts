import { Result } from 'src/common/domain/result-handler/result';
import { IApplicationService } from '../../../common/application/application-services/application-service.interface';
import { ISignInEntryApplication } from '../dto/entry/sign-in-entry.application.dto';
import { ISignUpResponseApplication } from '../dto/response/sing-up-response.application.dto';
import { IUserRepository } from '../repository/user-repository.interface';
import { ICrypto } from 'src/common/application/crypto/crypto';
import { IJwtGenerator } from '../../../common/application/jwt-generator/jwt-generator.interface';
import { ICustomerRepository } from 'src/customer/domain/repositories/customer-repository.interface';
import { ILoginResponseApplication } from '../dto/response/login-response.application.dto';

export class AuthLoginUserApplicationService implements IApplicationService<ISignInEntryApplication, ILoginResponseApplication> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: ICrypto,
    private readonly jwtGenerator: IJwtGenerator,
    private readonly costumerRepository: ICustomerRepository,
  ) {}

  async execute(data: ISignInEntryApplication): Promise<Result<ILoginResponseApplication>> {
    const emailLower = data.email.toLowerCase();

    const findUser = await this.userRepository.getByEmail(emailLower);

    if (findUser.getAssigned() === false) {
      return Result.fail<ILoginResponseApplication>(null, 400, 'User not found');
    }

    const passwordHash = await this.passwordHasher.compare(data.password, findUser.getValue().passwordUser);

    if (passwordHash === false) {
      return Result.fail<ILoginResponseApplication>(null, 400, 'Invalid Credentials');
    }

    const costumer = await this.costumerRepository.findById(findUser.getValue().costumerId);

    if (!costumer.isSuccess()) {
      return Result.fail<ILoginResponseApplication>(null, 500, 'Costumer not found');
    }

    const token = this.jwtGenerator.generateJwt(findUser.getValue().idUser);

    const response: ILoginResponseApplication = {
      id: findUser.getValue().idUser,
      email: findUser.getValue().emailUser,
      name: costumer.Value.Name.Name,
      phone: costumer.Value.Phone.Phone,
      token: token,
      type: findUser.getValue().roleUser,
    };

    return Result.success<ILoginResponseApplication>(response, 200);
  }
}
