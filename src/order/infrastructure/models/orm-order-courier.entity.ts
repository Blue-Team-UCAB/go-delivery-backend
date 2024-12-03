import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrderORMEntity } from './orm-order.entity';

@Entity('OrderCourier')
export class OrderCourierORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @OneToMany(() => OrderORMEntity, order => order.courier_Orders)
  orders: OrderORMEntity[];
}
