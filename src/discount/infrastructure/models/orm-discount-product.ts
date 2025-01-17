import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DiscountORMEntity } from './orm-discount.entity';
import { ProductORMEntity } from '../../../product/infrastructure/models/orm-product.entity';

@Entity('DiscountProduct')
export class DiscountProductORMEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => DiscountORMEntity, discount => discount.discount_Products)
  discount: DiscountORMEntity;

  @ManyToOne(() => ProductORMEntity, product => product.discount_Products)
  product: ProductORMEntity;
}
