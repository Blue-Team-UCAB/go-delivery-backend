import { CustomerORMEntity } from 'src/customer/infrastructure/model/orm-customer.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('Payment')
export class PaymentORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id_Payment: string;

  @Column()
  name_Payment: string;

  @Column()
  date_Payment: Date;

  @Column('float')
  amount_Payment: number;

  @Column()
  reference_Payment: string;

  @ManyToOne(() => CustomerORMEntity, costumer => costumer.id_Costumer)
  @JoinColumn()
  costumer: CustomerORMEntity;
}
