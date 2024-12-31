import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CustomerORMEntity } from './orm-customer.entity';

@Entity('Direction')
export class DirectionORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id_Direction: string;

  @Column()
  direction_Direction: string;

  @Column()
  latitude_Direction: string;

  @Column()
  longuitud_Direction: string;

  @Column()
  name_Direction: string;

  @ManyToOne(() => CustomerORMEntity, costumer => costumer.direction, { nullable: false })
  costumer_Direction: CustomerORMEntity;
}
