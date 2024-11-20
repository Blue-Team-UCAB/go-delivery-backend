// src/bundle/infrastructure/models/orm-bundle-product.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { BundleORMEntity } from './orm-bundle.entity';
import { ProductORMEntity } from '../../../product/infrastructure/models/orm-product.entity';

@Entity('BundleProduct')
export class BundleProductORMEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => BundleORMEntity, bundle => bundle.bundleProducts)
  bundle: BundleORMEntity;

  @ManyToOne(() => ProductORMEntity, product => product.bundleProducts)
  product: ProductORMEntity;

  @Column('int')
  quantity: number;
}
