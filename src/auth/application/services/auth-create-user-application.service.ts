import { Result } from 'src/common/domain/result-handler/result';
import { IApplicationService } from '../../../common/application/application-services/application-service.interface';
import { ISignUpEntryApplication } from '../dto/entry/sign-up-entry.application.dto';
import { ISignUpResponseApplication } from '../dto/response/sing-up-response.application.dto';
import { IUserRepository } from '../repository/user-repository.interface';

export class AuthCreateUserApplicationService implements IApplicationService<ISignUpEntryApplication, ISignUpResponseApplication> {
  constructor(private readonly userRepository: IUserRepository) {}

  execute(data: ISignUpEntryApplication): Promise<Result<ISignUpResponseApplication>> {
    throw new Error('Method not implemented.');
  }
}
