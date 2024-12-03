import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { CustomerORMEntity } from './orm-customer.entity';

@Entity('Wallet')
export class WalletORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id_Wallet: string;

  @Column('float')
  amount_Wallet: number;

  @Column()
  currency_Wallet: string;

  @OneToOne(() => CustomerORMEntity, costumer => costumer.id_Costumer, { cascade: true, nullable: false })
  costumer: CustomerORMEntity;
}
