import { CustomerORMEntity } from 'src/customer/infrastructure/model/orm-customer.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity('User')
export class UserORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id_User: string;

  @Column()
  email_User: string;

  @Column()
  password_User: string;

  @Column()
  role_User: string;

  @Column({ nullable: true })
  stripeId: string;

  @Column({ nullable: true })
  expirationCodeDate: Date;

  @Column({ nullable: true })
  verification_Code?: string;

  @Column({ nullable: false, array: true, type: 'varchar', default: '{}' })
  linkedDivices: string[];

  @OneToOne(() => CustomerORMEntity, costumer => costumer.id_Costumer, { cascade: true, nullable: false })
  @JoinColumn()
  costumer: CustomerORMEntity;
}
