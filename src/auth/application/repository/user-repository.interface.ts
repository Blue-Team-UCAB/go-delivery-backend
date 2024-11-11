import { Result } from '../../../common/domain/result-handler/result';
import { User } from '../model/user-model';

export interface IUserRepository {
  saveUser(user: User): Promise<Result<User>>;
  getByEmail(email: string): Promise<Result<User>>;
  getById(id: string): Promise<Result<User>>;
}
