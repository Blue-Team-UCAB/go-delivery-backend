import { IApplicationService } from 'src/common/application/application-services/application-service.interface';
import { IChangePasswordCodeEntryApplication } from '../dto/entry/changepassword-code.entry.application.dto';
import { IForgotPasswordResponseApplication } from '../dto/response/forgot-password.response.application.dto';
import { Result } from 'src/common/domain/result-handler/result';
import { IUserRepository } from '../repository/user-repository.interface';
import { IDateService } from '../../../common/application/date-service/date-service.interface';
import { ICrypto } from '../../../common/application/crypto/crypto';
import { User } from '../model/user-model';

export class ChangePasswordCodeUserApplicationService implements IApplicationService<IChangePasswordCodeEntryApplication, IForgotPasswordResponseApplication> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly dateService: IDateService,
    private readonly codeHasher: ICrypto,
  ) {}

  async execute(data: IChangePasswordCodeEntryApplication): Promise<Result<IForgotPasswordResponseApplication>> {
    const user = await this.userRepository.getByEmail(data.email);

    if (user.getAssigned() === false) {
      return Result.fail<IForgotPasswordResponseApplication>(null, 404, 'User not found');
    }

    const expirationDate = this.dateService.toUtcMinus4(user.getValue().expirationCodeDate);

    if (!expirationDate || expirationDate < this.dateService.now()) {
      return Result.fail<IForgotPasswordResponseApplication>(null, 400, 'Code expired');
    }

    const upperCode = data.code.toUpperCase();

    if (!(await this.codeHasher.compare(upperCode, user.getValue().verificationCode))) {
      return Result.fail<IForgotPasswordResponseApplication>(null, 400, 'Invalid code');
    }

    const hashedPassword = await this.codeHasher.encrypt(data.password);

    const newUser: User = {
      ...user.getValue(),
      passwordUser: hashedPassword,
      expirationCodeDate: null,
      verificationCode: null,
    };

    const result = await this.userRepository.updateUser(newUser);

    if (!result) {
      return Result.fail<IForgotPasswordResponseApplication>(null, 500, 'Internal server error');
    }

    return Result.success<IForgotPasswordResponseApplication>('Password changed', 200);
  }
}
