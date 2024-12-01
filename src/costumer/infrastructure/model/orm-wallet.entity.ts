import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { CostumerORMEntity } from './orm-costumer.entity';

@Entity('Wallet')
export class WalletORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id_Wallet: string;

  @Column('float')
  amount_Wallet: number;

  @Column()
  currency_Wallet: string;

  @OneToOne(() => CostumerORMEntity, costumer => costumer.id_Costumer, { cascade: true, nullable: false })
  costumer: CostumerORMEntity;
}
