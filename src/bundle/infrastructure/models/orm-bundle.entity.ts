import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BundleProductORMEntity } from './orm-bundle-product.entity';
import { OrderBundleORMEntity } from 'src/order/infrastructure/models/orm-order-bundle.entity';
// import { BundleBundleORMEntity } from './orm-bundle-bundle.entity';

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

  @OneToMany(() => BundleProductORMEntity, bundleProduct => bundleProduct.bundle, { cascade: true })
  bundleProducts: BundleProductORMEntity[];

  @OneToMany(() => OrderBundleORMEntity, orderBundle => orderBundle.bundle, { cascade: true })
  orders_Bundles: OrderBundleORMEntity[];

  // @OneToMany(() => BundleBundleORMEntity, bundleBundle => bundleBundle.parentBundle, { cascade: true })
  // parentBundles: BundleBundleORMEntity[];

  // @OneToMany(() => BundleBundleORMEntity, bundleBundle => bundleBundle.childBundle, { cascade: true })
  // childBundles: BundleBundleORMEntity[];
}
