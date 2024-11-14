import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { BundleORMEntity } from './orm-bundle.entity';

@Entity('BundleProduct')
export class BundleProductORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id_Bundle_Product: string;

  @Column()
  productId_Bundle_Product: string;

  @Column()
  name_Bundle_Product: string;

  @Column('float')
  price_Bundle_Product: number;

  @Column('float')
  weight_Bundle_Product: number;

  @Column('int')
  quantity_Bundle_Product: number;

  @ManyToOne(() => BundleORMEntity, bundle => bundle.bundleProducts)
  bundle: BundleORMEntity;
}
