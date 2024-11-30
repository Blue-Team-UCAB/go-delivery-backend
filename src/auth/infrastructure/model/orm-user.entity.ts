import { CostumerORMEntity } from 'src/costumer/infrastructure/model/orm-costumer.entity';
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
  expirationCodeDate: Date;

  @Column({ nullable: true })
  verification_Code?: string;

  @OneToOne(() => CostumerORMEntity, costumer => costumer.id_Costumer, { cascade: true, nullable: false, eager: true })
  @JoinColumn()
  costumer: CostumerORMEntity;
}
