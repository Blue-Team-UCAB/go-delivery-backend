// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
// import { BundleORMEntity } from './orm-bundle.entity';

// @Entity('BundleBundle')
// export class BundleBundleORMEntity {
//   @PrimaryGeneratedColumn('increment')
//   id: number;

//   @ManyToOne(() => BundleORMEntity, bundle => bundle.parentBundles)
//   parentBundle: BundleORMEntity;

//   @ManyToOne(() => BundleORMEntity, bundle => bundle.childBundles)
//   childBundle: BundleORMEntity;

//   @Column('int')
//   quantity: number;
// }
