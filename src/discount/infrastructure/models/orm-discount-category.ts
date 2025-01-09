import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DiscountORMEntity } from './orm-discount.entity';
import { CategoryORMEntity } from '../../../category/infrastructure/models/orm-category.entity';

@Entity('DiscountCategory')
export class DiscountCategoryORMEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => DiscountORMEntity, discount => discount.discount_Categories)
  discount: DiscountORMEntity;

  @ManyToOne(() => CategoryORMEntity, category => category.discount_Categories)
  category: CategoryORMEntity;
}
