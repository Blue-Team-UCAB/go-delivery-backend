import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { CustomerORMEntity } from '../../../customer/infrastructure/model/orm-customer.entity';
import { OrderProductORMEntity } from './orm-order-product.entity';
import { OrderBundleORMEntity } from './orm-order-bundle.entity';
import { OrderCourierORMEntity } from './orm-order-courier.entity';
import { OrderStateHistoryORMEntity } from './orm-order-state.entity';
import { CouponORMEntity } from '../../../coupon/infrastructure/models/orm-coupon.entity';
import { OrderCourierMovementORMEntity } from './orm-order-courier-movement.entity';

@Entity('Order')
export class OrderORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id_Order: string;

  @Column()
  createdDate_Order: Date;

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

  @ManyToOne(() => CustomerORMEntity, customer => customer.order, { nullable: false })
  customer_Orders: CustomerORMEntity;

  @ManyToOne(() => OrderCourierORMEntity, courier => courier.orders, { nullable: true })
  @JoinColumn()
  courier_Orders: OrderCourierORMEntity;

  @ManyToOne(() => CouponORMEntity, coupon => coupon.orders, { nullable: true })
  @JoinColumn()
  coupon: CouponORMEntity;

  @OneToMany(() => OrderProductORMEntity, orderProduct => orderProduct.order, { cascade: true })
  order_Products: OrderProductORMEntity[];

  @OneToMany(() => OrderBundleORMEntity, orderBundle => orderBundle.order, { cascade: true })
  order_Bundles: OrderBundleORMEntity[];

  @OneToMany(() => OrderStateHistoryORMEntity, orderStateHistory => orderStateHistory.order, { cascade: true })
  order_StateHistory: OrderStateHistoryORMEntity[];

  @OneToOne(() => OrderCourierMovementORMEntity, courier => courier.orders, { cascade: true })
  courier_Movement: OrderCourierMovementORMEntity;
}
