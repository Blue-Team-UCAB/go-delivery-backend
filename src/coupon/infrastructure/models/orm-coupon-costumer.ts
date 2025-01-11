import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CouponORMEntity } from './orm-coupon.entity';
import { CustomerORMEntity } from '../../../customer/infrastructure/model/orm-customer.entity';

@Entity('CouponCustomer')
export class CouponCustomerORMEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => CouponORMEntity, coupon => coupon.coupon_Customers)
  coupon: CouponORMEntity;

  @ManyToOne(() => CustomerORMEntity, customer => customer.coupon_Customers)
  customer: CustomerORMEntity;

  @Column('int')
  remainingUses: number;
}
