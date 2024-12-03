import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { OrderORMEntity } from './orm-order.entity';
import { BundleORMEntity } from '../../../bundle/infrastructure/models/orm-bundle.entity';

@Entity('OrderBundle')
export class OrderBundleORMEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => OrderORMEntity, order => order.order_Bundles)
  order: OrderORMEntity;

  @ManyToOne(() => BundleORMEntity, bundle => bundle.orders_Bundles)
  bundle: BundleORMEntity;

  @Column('int')
  quantity: number;
}
