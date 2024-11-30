import { UserORMEntity } from 'src/auth/infrastructure/model/orm-user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { WalletORMEntity } from './orm-wallet.entity';

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

  @OneToOne(() => WalletORMEntity, wallet => wallet.id_Wallet, { cascade: true, nullable: true })
  @JoinColumn()
  wallet: WalletORMEntity;
}
