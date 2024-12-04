import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { CouponORMEntity } from './orm-coupon.entity';
import { CustomerORMEntity } from '../../../customer/infrastructure/model/orm-customer.entity';

@Entity('CustomerCoupon')
export class CustomerCouponORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CustomerORMEntity, customer => customer.customerCoupons)
  customer: CustomerORMEntity;

  @ManyToOne(() => CouponORMEntity, coupon => coupon.customerCoupons)
  coupon: CouponORMEntity;

  @Column('int')
  uses: number;
}
