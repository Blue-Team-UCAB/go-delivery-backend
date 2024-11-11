import { User } from '../../application/model/user-model';
import { IUserRepository } from '../../application/repository/user-repository.interface';
import { Result } from '../../../common/domain/result-handler/result';
import { Repository, DataSource } from 'typeorm';
import { UserORMEntity } from '../model/orm-user.entity';

export class UserRepository extends Repository<UserORMEntity> implements IUserRepository {
  constructor(dataSource: DataSource) {
    super(UserORMEntity, dataSource.createEntityManager());
  }

  saveUser(user: User): Promise<Result<User>> {
    throw new Error('Method not implemented.');
  }

  async getByEmail(email: string): Promise<Result<User>> {
    throw new Error('Method not implemented.');
  }

  getById(id: string): Promise<Result<User>> {
    throw new Error('Method not implemented.');
  }
}
