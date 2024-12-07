import { User } from '../../application/model/user-model';
import { IUserRepository } from '../../application/repository/user-repository.interface';
import { Result } from '../../../common/domain/result-handler/result';
import { Repository, DataSource } from 'typeorm';
import { UserORMEntity } from '../model/orm-user.entity';
import { UserMapper } from '../mappers/user.mapper';
import { Optional } from 'src/common/domain/result-handler/optional.handler';
import { InternalServerErrorException } from '@nestjs/common';

export class UserRepository extends Repository<UserORMEntity> implements IUserRepository {
  private readonly userMapper: UserMapper;

  constructor(dataSource: DataSource) {
    super(UserORMEntity, dataSource.createEntityManager());
    this.userMapper = new UserMapper();
  }

  async getByEmail(email: string): Promise<Optional<User>> {
    try {
      const user = await this.createQueryBuilder('user')
        .select(['user.id_User', 'user.email_User', 'user.password_User', 'user.role_User', 'user.expirationCodeDate', 'user.verification_Code'])
        .leftJoinAndSelect('user.costumer', 'costumer')
        .addSelect(['costumer.id_Costumer', 'costumer.name_Costumer', 'costumer.phone_Costumer'])
        .where('user.email_User = :email', { email })
        .getOne();

      if (user) {
        let userDomain = await this.userMapper.fromPersistenceToDomain(user);
        return new Optional<User>(userDomain);
      }
      return new Optional<User>();
    } catch (error) {
      throw new InternalServerErrorException({ error });
    }
  }

  async getById(id: string): Promise<Optional<User>> {
    try {
      const user = await this.createQueryBuilder('user')
        .select(['user.id_User', 'user.email_User', 'user.password_User', 'user.role_User', 'user.expirationCodeDate', 'user.verification_Code', 'user.stripeId', 'user.linkedDivices'])
        .leftJoinAndSelect('user.costumer', 'costumer')
        .addSelect(['costumer.id_Costumer', 'costumer.name_Costumer', 'costumer.phone_Costumer'])
        .where('user.id_User = :id', { id })
        .getOne();

      if (user) {
        let userDomain = await this.userMapper.fromPersistenceToDomain(user);
        return new Optional<User>(userDomain);
      }
      return new Optional<User>();
    } catch (error) {
      throw new InternalServerErrorException({ error });
    }
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

  async getAllEmails(): Promise<string[]> {
    try {
      const emails = await this.find({ select: ['email_User'] });
      return emails.map(email => email.email_User);
    } catch (error) {
      throw new InternalServerErrorException({ error });
    }
  }

  async updateUser(user: User): Promise<Result<User>> {
    try {
      const userEntity = await this.userMapper.fromDomainToPersistence(user);
      await this.save(userEntity);
      return Result.success<User>(user, 200);
    } catch (error) {
      return Result.fail<User>(new Error(error.message), error.code, error.message);
    }
  }

  async getByIdCostumer(id: string): Promise<Optional<User>> {
    try {
      const user = await this.createQueryBuilder('user')
        .select(['user.id_User', 'user.email_User', 'user.password_User', 'user.role_User', 'user.expirationCodeDate', 'user.verification_Code', 'user.stripeId', 'user.linkedDivices'])
        .leftJoinAndSelect('user.costumer', 'costumer')
        .addSelect(['costumer.id_Costumer', 'costumer.name_Costumer', 'costumer.phone_Costumer'])
        .where('costumer.id_Costumer = :id', { id })
        .getOne();

      if (user) {
        let userDomain = await this.userMapper.fromPersistenceToDomain(user);
        return new Optional<User>(userDomain);
      }
      return new Optional<User>();
    } catch (error) {
      throw new InternalServerErrorException({ error });
    }
  }
}
