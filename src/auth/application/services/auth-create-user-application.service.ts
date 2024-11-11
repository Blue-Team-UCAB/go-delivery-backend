import { IApplicationService } from '../../../common/application/application-services/application-service.interface';
import { IUserRepository } from '../repository/user-repository.interface';

export class AuthCreateUserApplicationService {
  constructor(private readonly userRepository: IUserRepository) {}

  async login(email: string, password: string): Promise<string> {
    throw new Error('Method not implemented.');
  }
}
