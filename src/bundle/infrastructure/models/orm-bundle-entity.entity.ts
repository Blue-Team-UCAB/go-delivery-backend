import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { BundleORMEntity } from './orm-bundle.entity';

@Entity('BundleEntity')
export class BundleEntityORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id_Bundle_Entity: string;

  @Column()
  bundleId_Bundle_Entity: string;

  @Column()
  name_Bundle_Entity: string;

  @Column('float')
  price_Bundle_Entity: number;

  @Column('float')
  weight_Bundle_Entity: number;

  @Column('int')
  quantity_Bundle_Entity: number;

  @ManyToOne(() => BundleORMEntity, bundle => bundle.bundleEntities)
  bundle: BundleORMEntity;
}
