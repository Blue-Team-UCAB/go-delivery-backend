import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { OrderORMEntity } from './orm-order.entity';

@Entity('OrderStateHistory')
export class OrderStateHistoryORMEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  state: string;

  @Column()
  date: Date;

  @ManyToOne(() => OrderORMEntity, order => order.order_StateHistory)
  order: OrderORMEntity;
}
