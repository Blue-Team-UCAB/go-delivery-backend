import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CustomerCouponORMEntity } from './orm-coupon-customer.entity';

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

  @OneToMany(() => CustomerCouponORMEntity, customerCoupon => customerCoupon.coupon)
  customerCoupons: CustomerCouponORMEntity[];
}
