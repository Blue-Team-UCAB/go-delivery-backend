import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany, JoinColumn } from 'typeorm';
import { CustomerORMEntity } from '../../../customer/infrastructure/model/orm-customer.entity';
import { OrderProductORMEntity } from './orm-order-product.entity';
import { OrderBundleORMEntity } from './orm-order-bundle.entity';
import { OrderCourierORMEntity } from './orm-order-courier.entity';

@Entity('Order')
export class OrderORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id_Order: string;

  @Column()
  state_Order: string;

  @Column()
  createdDate_Order: Date;

  @Column({ nullable: true })
  receiveDate_Order: Date;

  @Column('float')
  totalAmount_Order: number;

  @Column('float')
  subtotalAmount_Order: number;

  @Column()
  direction_Order: string;

  @Column('float')
  longitude_Order: number;

  @Column('float')
  latitude_Order: number;

  @Column({ nullable: true })
  claimDate_Order: Date;

  @Column({ nullable: true })
  claim_Order: string;

  @ManyToOne(() => CustomerORMEntity, customer => customer.order, { cascade: true, nullable: false })
  customer_Orders: CustomerORMEntity;

  @ManyToOne(() => OrderCourierORMEntity, courier => courier.orders, { nullable: true })
  @JoinColumn()
  courier_Orders: OrderCourierORMEntity;

  @OneToMany(() => OrderProductORMEntity, orderProduct => orderProduct.order, { cascade: true })
  order_Products: OrderProductORMEntity[];

  @OneToMany(() => OrderBundleORMEntity, orderBundle => orderBundle.order, { cascade: true })
  order_Bundles: OrderBundleORMEntity[];
}
