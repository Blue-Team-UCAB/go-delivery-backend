import { Result } from 'src/common/domain/result-handler/result';
import { IApplicationService } from '../../../common/application/application-services/application-service.interface';
import { ISignInEntryApplication } from '../dto/entry/sign-in-entry.application.dto';
import { ISignUpResponseApplication } from '../dto/response/sing-up-response.application.dto';
import { IUserRepository } from '../repository/user-repository.interface';
import { ICrypto } from 'src/common/application/crypto/crypto';
import { IJwtGenerator } from '../../../common/application/jwt-generator/jwt-generator.interface';

export class AuthLoginUserApplicationService implements IApplicationService<ISignInEntryApplication, ISignUpResponseApplication> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: ICrypto,
    private readonly jwtGenerator: IJwtGenerator,
  ) {}

  async execute(data: ISignInEntryApplication): Promise<Result<ISignUpResponseApplication>> {
    const findUser = await this.userRepository.getByEmail(data.email);

    if (findUser.getAssigned() === false) {
      return Result.fail<ISignUpResponseApplication>(null, 400, 'User not found');
    }

    const passwordHash = await this.passwordHasher.compare(data.password, findUser.getValue().passwordUser);

    if (passwordHash === false) {
      return Result.fail<ISignUpResponseApplication>(null, 400, 'Password incorrect');
    }

    const token = this.jwtGenerator.generateJwt(findUser.getValue().idUser);

    const response: ISignUpResponseApplication = {
      id: findUser.getValue().idUser,
      name: findUser.getValue().nameUser,
      email: findUser.getValue().emailUser,
      jwt_token: token,
    };

    return Result.success<ISignUpResponseApplication>(response, 200);
  }
}
