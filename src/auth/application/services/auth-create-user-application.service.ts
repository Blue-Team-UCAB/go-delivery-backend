import { Result } from 'src/common/domain/result-handler/result';
import { IApplicationService } from '../../../common/application/application-services/application-service.interface';
import { ISignUpEntryApplication } from '../dto/entry/sign-up-entry.application.dto';
import { ISignUpResponseApplication } from '../dto/response/sing-up-response.application.dto';
import { IUserRepository } from '../repository/user-repository.interface';
import { IdGenerator } from '../../../common/application/id-generator/id-generator.interface';
import { User } from '../model/user-model';
import { ICrypto } from 'src/common/application/crypto/crypto';
import { IJwtGenerator } from '../../../common/application/jwt-generator/jwt-generator.interface';
export class AuthCreateUserApplicationService implements IApplicationService<ISignUpEntryApplication, ISignUpResponseApplication> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly idGenerator: IdGenerator<string>,
    private readonly passwordHasher: ICrypto,
    private readonly jwtGenerator: IJwtGenerator,
  ) {}

  async execute(data: ISignUpEntryApplication): Promise<Result<ISignUpResponseApplication>> {
    const findUser = await this.userRepository.getByEmail(data.email);
    if (findUser.getAssigned() === true) {
      return Result.fail<ISignUpResponseApplication>(null, 400, 'Email already in use');
    }

    const userId = await this.idGenerator.generateId();
    const hashpassword = await this.passwordHasher.encrypt(data.password);

    const user = {
      idUser: userId,
      nameUser: data.name,
      emailUser: data.email,
      passwordUser: hashpassword,
      roleUser: 'CLIENT',
      phoneUser: data.phone,
    } satisfies User;

    const createUser = await this.userRepository.saveUser(user);

    if (!createUser.isSuccess()) {
      return Result.fail<ISignUpResponseApplication>(createUser.Error, createUser.StatusCode, createUser.Message);
    }

    const response: ISignUpResponseApplication = {
      name: data.name,
      email: data.email,
      jwt_token: this.jwtGenerator.generateJwt(userId),
    };

    return Result.success<ISignUpResponseApplication>(response, 200);
  }
}
