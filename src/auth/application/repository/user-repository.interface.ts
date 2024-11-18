import { Result } from '../../../common/domain/result-handler/result';
import { User } from '../model/user-model';
import { Optional } from '../../../common/domain/result-handler/optional.handler';

export interface IUserRepository {
  saveUser(user: User): Promise<Result<User>>;
  getByEmail(email: string): Promise<Optional<User>>;
  getById(id: string): Promise<Optional<User>>;
  updateUser(user: User): Promise<Result<User>>;
}
