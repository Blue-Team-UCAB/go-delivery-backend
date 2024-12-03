import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { OrderORMEntity } from './orm-order.entity';
import { ProductORMEntity } from '../../../product/infrastructure/models/orm-product.entity';

@Entity('OrderProduct')
export class OrderProductORMEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => OrderORMEntity, order => order.order_Products)
  order: OrderORMEntity;

  @ManyToOne(() => ProductORMEntity, product => product.order_Products)
  product: ProductORMEntity;

  @Column('int')
  quantity: number;
}
