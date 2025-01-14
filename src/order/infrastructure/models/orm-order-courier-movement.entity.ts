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

  @Column({
    nullable: true,
  })
  longitudePuntoActual: string;

  @Column({
    nullable: true,
  })
  latitudePuntoActual: string;

  @Column({
    nullable: true,
  })
  lastUpdated: Date;

  @Column('simple-json')
  routeSteps: { lat: number; lng: number }[];

  @Column()
  currentStepIndex: number;

  @OneToOne(() => OrderORMEntity, order => order.id_Order, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn()
  orders: OrderORMEntity;
}
