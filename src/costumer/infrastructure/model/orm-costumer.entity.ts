import { UserORMEntity } from 'src/auth/infrastructure/model/orm-user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';

@Entity('Customer')
export class CostumerORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id_Costumer: string;

  @Column()
  name_Costumer: string;

  @Column()
  phone_Costumer: string;

  @OneToOne(() => UserORMEntity, user => user.id_User, { cascade: true, nullable: false })
  user: UserORMEntity;
}
