import { UserORMEntity } from 'src/auth/infrastructure/model/orm-user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, IsNull } from 'typeorm';
import { WalletORMEntity } from './orm-wallet.entity';
import { OrderORMEntity } from '../../../order/infrastructure/models/orm-order.entity';
import { DirectionORMEntity } from './orm-direction.entity';
import { CouponCustomerORMEntity } from 'src/coupon/infrastructure/models/orm-coupon-customer';

@Entity('Customer')
export class CustomerORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id_Costumer: string;

  @Column()
  name_Costumer: string;

  @Column()
  phone_Costumer: string;

  @Column({
    nullable: true,
  })
  image_Costumer?: string;

  @OneToOne(() => UserORMEntity, user => user.id_User, { cascade: true, nullable: false })
  user: UserORMEntity;

  @OneToOne(() => WalletORMEntity, wallet => wallet.id_Wallet, { cascade: true, nullable: false })
  @JoinColumn()
  wallet: WalletORMEntity;

  @OneToMany(() => DirectionORMEntity, direction => direction.costumer_Direction, { cascade: true, nullable: false })
  direction: DirectionORMEntity[];

  @OneToMany(() => OrderORMEntity, order => order.customer_Orders, { cascade: true, nullable: false })
  order: OrderORMEntity[];

  @OneToMany(() => CouponCustomerORMEntity, couponCustomer => couponCustomer.customer, { cascade: true })
  coupon_Customers: CouponCustomerORMEntity[];
}
