import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany, OneToOne, JoinTable, JoinColumn } from 'typeorm';
import { OrderORMEntity } from './orm-order.entity';

@Entity('OrderCourierMovement')
export class OrderCourierMovementORMEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  longitudePuntoLlegada: string;

  @Column()
  latitudePuntoLlegada: string;

  @Column()
  longitudePuntoActual: string;

  @Column()
  latitudePuntoActual: string;

  @Column()
  lastUpdated: Date;

  @OneToOne(() => OrderORMEntity, order => order.id_Order, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn()
  orders: OrderORMEntity;
}
