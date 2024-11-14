import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BundleEntityORMEntity } from './orm-bundle-entity.entity';
import { BundleProductORMEntity } from './orm-bundle-product.entity';

@Entity('Bundle')
export class BundleORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  currency: string;

  @Column('float')
  price: number;

  @Column('int')
  stock: number;

  @Column('float')
  weight: number;

  @Column()
  imageUrl: string;

  @Column()
  caducityDate: Date;

  @OneToMany(() => BundleEntityORMEntity, bundleEntity => bundleEntity.bundle, { cascade: true })
  bundleEntities: BundleEntityORMEntity[];

  @OneToMany(() => BundleProductORMEntity, bundleProduct => bundleProduct.bundle, { cascade: true })
  bundleProducts: BundleProductORMEntity[];
}
