import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { CustomerORMEntity } from './orm-customer.entity';

@Entity('Direction')
export class DirectionORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id_Direction: string;

  @Column('float')
  direction_Direction: number;

  @Column()
  latitude_Direction: string;

  @Column()
  longuitud_Direction: string;

  @ManyToOne(() => CustomerORMEntity, costumer => costumer.direction, { nullable: false })
  costumer_Direction: CustomerORMEntity;
}
