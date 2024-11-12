import { User } from '../../application/model/user-model';
import { IUserRepository } from '../../application/repository/user-repository.interface';
import { Result } from '../../../common/domain/result-handler/result';
import { Repository, DataSource } from 'typeorm';
import { UserORMEntity } from '../model/orm-user.entity';
import { UserMapper } from '../mappers/user.mapper';
import { Optional } from 'src/common/domain/result-handler/optional.handler';

export class UserRepository extends Repository<UserORMEntity> implements IUserRepository {
  private readonly userMapper: UserMapper;

  constructor(dataSource: DataSource) {
    super(UserORMEntity, dataSource.createEntityManager());
    this.userMapper = new UserMapper();
  }

  async getByEmail(email: string): Promise<Optional<User>> {
    try {
      const user = await this.findOne({ where: { email_User: email } });
      if (user) {
        let userDomain = await this.userMapper.fromPersistenceToDomain(user);
        return new Optional<User>(userDomain);
      }
      return new Optional<User>();
    } catch (error) {
      console.log(error);
    }
  }

  getById(id: string): Promise<Optional<User>> {
    throw new Error('Method not implemented.');
  }

  async saveUser(user: User): Promise<Result<User>> {
    try {
      const userEntity = await this.userMapper.fromDomainToPersistence(user);
      await this.save(userEntity);
      return Result.success<User>(user, 201);
    } catch (error) {
      return Result.fail<User>(new Error(error.message), error.code, error.message);
    }
  }
}
