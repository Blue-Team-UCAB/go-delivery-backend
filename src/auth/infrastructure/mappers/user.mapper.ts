import { User, UserType } from '../../application/model/user-model';
import { IMapper } from '../../../common//application/mapper/mapper.interface';
import { UserORMEntity } from '../model/orm-user.entity';
import { CustomerORMEntity } from 'src/customer/infrastructure/model/orm-customer.entity';

export class UserMapper implements IMapper<User, UserORMEntity> {
  async fromDomainToPersistence(domain: User): Promise<UserORMEntity> {
    const user = new UserORMEntity();
    user.id_User = domain.idUser;
    user.email_User = domain.emailUser;
    user.password_User = domain.passwordUser;
    user.role_User = domain.roleUser;
    user.stripeId = domain.stripeId;
    user.costumer = { id_Costumer: domain.costumerId } as CustomerORMEntity;
    user.expirationCodeDate = domain.expirationCodeDate;
    user.verification_Code = domain.verificationCode;
    user.linkedDivices = domain.linkedDivices;
    return user;
  }

  async fromPersistenceToDomain(persistence: UserORMEntity): Promise<User> {
    return {
      idUser: persistence.id_User,
      emailUser: persistence.email_User,
      passwordUser: persistence.password_User,
      roleUser: persistence.role_User as UserType,
      expirationCodeDate: persistence.expirationCodeDate,
      verificationCode: persistence.verification_Code,
      costumerId: persistence.costumer.id_Costumer,
      stripeId: persistence.stripeId,
      linkedDivices: persistence.linkedDivices,
    } as User;
  }
}
