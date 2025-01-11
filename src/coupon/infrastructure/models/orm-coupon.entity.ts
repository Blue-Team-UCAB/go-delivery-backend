import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrderORMEntity } from '../../../order/infrastructure/models/orm-order.entity';
import { CouponCustomerORMEntity } from './orm-coupon-costumer';

@Entity('Coupon')
export class CouponORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  startDate: Date;

  @Column()
  expirationDate: Date;

  @Column('float')
  porcentage: number;

  @Column()
  code: string;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column('int')
  numberUses: number;

  @OneToMany(() => OrderORMEntity, order => order.coupon)
  orders: OrderORMEntity[];

  @OneToMany(() => CouponCustomerORMEntity, couponCustomer => couponCustomer.coupon, { cascade: true })
  coupon_Customers: CouponCustomerORMEntity[];
}
