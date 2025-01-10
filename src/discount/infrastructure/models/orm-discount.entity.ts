import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DiscountProductORMEntity } from './orm-discount-product';
import { DiscountBundleORMEntity } from './orm-discount-bundle';
import { DiscountCategoryORMEntity } from './orm-discount-category';

@Entity('Discount')
export class DiscountORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  startDate: Date;

  @Column()
  expirationDate: Date;

  @Column('float')
  percentage: number;

  @Column()
  state: string;

  @OneToMany(() => DiscountProductORMEntity, discountProduct => discountProduct.discount, { cascade: true })
  discount_Products: DiscountProductORMEntity[];

  @OneToMany(() => DiscountBundleORMEntity, discountBundle => discountBundle.discount, { cascade: true })
  discount_Bundles: DiscountBundleORMEntity[];

  @OneToMany(() => DiscountCategoryORMEntity, discountCategory => discountCategory.discount, { cascade: true })
  discount_Categories: DiscountCategoryORMEntity[];
}
