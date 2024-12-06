import { Result } from 'src/common/domain/result-handler/result';
import { IApplicationService } from '../../../common/application/application-services/application-service.interface';
import { IPushTokenEntryApplication } from '../dto/entry/push-token.entry.application.dto';
import { IPushTokenResponseApplication } from '../dto/response/push-token.response.application.dto';
import { IUserRepository } from '../repository/user-repository.interface';
import { User } from '../model/user-model';

export class AuthPushTokenUserApplicationService implements IApplicationService<IPushTokenEntryApplication, IPushTokenResponseApplication> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(data: IPushTokenEntryApplication): Promise<Result<IPushTokenResponseApplication>> {
    const user = await this.userRepository.getById(data.idUser);

    if (user.getAssigned() === false) {
      return Result.fail<IPushTokenResponseApplication>(null, 404, 'User not found');
    }

    let link = user.getValue().linkedDivices;

    if (link.includes(data.token)) {
      return Result.success<IPushTokenResponseApplication>('', 200);
    }

    link.push(data.token);

    const newUser: User = {
      ...user.getValue(),
      linkedDivices: link,
    };

    const result = await this.userRepository.updateUser(newUser);

    if (!result.isSuccess()) {
      return Result.fail<IPushTokenResponseApplication>(null, 500, 'Internal server error');
    }

    return Result.success<IPushTokenResponseApplication>('', 200);
  }
}
