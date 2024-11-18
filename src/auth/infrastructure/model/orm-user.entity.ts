import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('User')
export class UserORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id_User: string;

  @Column()
  name_User: string;

  @Column()
  email_User: string;

  @Column()
  password_User: string;

  @Column()
  role_User: string;

  @Column()
  phone_User: string;

  @Column({ nullable: true })
  expirationCodeDate: Date;

  @Column({ nullable: true })
  verification_Code?: string;
}
