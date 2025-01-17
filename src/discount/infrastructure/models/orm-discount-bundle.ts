import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DiscountORMEntity } from './orm-discount.entity';
import { BundleORMEntity } from '../../../bundle/infrastructure/models/orm-bundle.entity';

@Entity('DiscountBundle')
export class DiscountBundleORMEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => DiscountORMEntity, discount => discount.discount_Bundles)
  discount: DiscountORMEntity;

  @ManyToOne(() => BundleORMEntity, bundle => bundle.discount_Bundles)
  bundle: BundleORMEntity;
}
