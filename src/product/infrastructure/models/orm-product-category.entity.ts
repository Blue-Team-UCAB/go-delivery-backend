import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ProductORMEntity } from './orm-product.entity';
import { CategoryORMEntity } from '../../../category/infrastructure/models/orm-category.entity';

@Entity('ProductCategory')
export class ProductCategoryORMEntity {
  @PrimaryGeneratedColumn('increment')
  id_: number;

  @ManyToOne(() => ProductORMEntity, product => product.product_Categories)
  product: ProductORMEntity;

  @ManyToOne(() => CategoryORMEntity, category => category.product_Categories)
  category: CategoryORMEntity;
}
