import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { BundleORMEntity } from './orm-bundle.entity';
import { CategoryORMEntity } from '../../../category/infrastructure/models/orm-category.entity';

@Entity('BundleCategory')
export class BundleCategoryORMEntity {
  @PrimaryGeneratedColumn('increment')
  id_: number;

  @ManyToOne(() => BundleORMEntity, bundle => bundle.bundle_Categories)
  bundle: BundleORMEntity;

  @ManyToOne(() => CategoryORMEntity, category => category.bundle_Categories)
  category: CategoryORMEntity;
}
