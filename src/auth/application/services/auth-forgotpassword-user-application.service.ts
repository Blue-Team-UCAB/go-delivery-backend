import { Result } from 'src/common/domain/result-handler/result';
import { IApplicationService } from '../../../common/application/application-services/application-service.interface';
import { IForgotPasswordEntryApplication } from '../dto/entry/forgot-password.entry.application.dto';
import { IForgotPasswordResponseApplication } from '../dto/response/forgot-password.response.application.dto';
import { IUserRepository } from '../repository/user-repository.interface';
import { IDateService } from '../../../common/application/date-service/date-service.interface';
import { ICrypto } from '../../../common/application/crypto/crypto';
import { IdGenerator } from 'src/common/application/id-generator/id-generator.interface';
import { User } from '../model/user-model';
import { IMailSender } from 'src/common/application/mail-sender/mail-sender.interface';

export class ForgotPasswordUserApplicationService implements IApplicationService<IForgotPasswordEntryApplication, IForgotPasswordResponseApplication> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly dateService: IDateService,
    private readonly codeHasher: ICrypto,
    private readonly codeGenerator: IdGenerator<string>,
    private readonly mailSender: IMailSender,
  ) {}

  async execute(data: IForgotPasswordEntryApplication): Promise<Result<IForgotPasswordResponseApplication>> {
    const user = await this.userRepository.getByEmail(data.email);

    if (!user) {
      return Result.fail<IForgotPasswordResponseApplication>(null, 404, 'User not found');
    }

    const expirationDate = this.dateService.getNowPlusMinutes(30);
    const verificationCode = await this.codeGenerator.generateId();
    const hashedCode = await this.codeHasher.encrypt(verificationCode);

    const newUser: User = {
      ...user.getValue(),
      expirationCodeDate: expirationDate,
      verificationCode: hashedCode,
    };

    const result = await this.userRepository.updateUser(newUser);

    if (!result) {
      return Result.fail<IForgotPasswordResponseApplication>(null, 500, 'Internal server error');
    }

    await this.mailSender.sendMail(newUser.emailUser, 'Verification code', `Your verification code is: ${verificationCode}`);

    return Result.success<IForgotPasswordResponseApplication>('Verification code sent', 200);
  }
}
