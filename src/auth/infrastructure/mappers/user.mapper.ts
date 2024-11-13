import { User, UserType } from '../../application/model/user-model';
import { IMapper } from '../../../common//application/mapper/mapper.interface';
import { UserORMEntity } from '../model/orm-user.entity';

export class UserMapper implements IMapper<User, UserORMEntity> {
  async fromDomainToPersistence(domain: User): Promise<UserORMEntity> {
    const user = new UserORMEntity();
    user.id_User = domain.idUser;
    user.name_User = domain.nameUser;
    user.email_User = domain.emailUser;
    user.password_User = domain.passwordUser;
    user.role_User = domain.roleUser;
    user.phone_User = domain.phoneUser;
    return user;
  }

  async fromPersistenceToDomain(persistence: UserORMEntity): Promise<User> {
    return {
      idUser: persistence.id_User,
      nameUser: persistence.name_User,
      emailUser: persistence.email_User,
      passwordUser: persistence.password_User,
      roleUser: persistence.role_User as UserType,
      phoneUser: persistence.phone_User,
    } as User;
  }
}
