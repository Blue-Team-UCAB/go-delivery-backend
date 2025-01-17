import { BundleCategoryORMEntity } from 'src/bundle/infrastructure/models/orm-bundle-category.entity';
import { DiscountCategoryORMEntity } from 'src/discount/infrastructure/models/orm-discount-category';
import { ProductCategoryORMEntity } from 'src/product/infrastructure/models/orm-product-category.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Category')
export class CategoryORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id_Category: string;

  @Column()
  name_Category: string;

  @Column()
  image_Category: string;

  @OneToMany(() => ProductCategoryORMEntity, productCategory => productCategory.category)
  product_Categories: ProductCategoryORMEntity[];

  @OneToMany(() => BundleCategoryORMEntity, bundleCategory => bundleCategory.category)
  bundle_Categories: BundleCategoryORMEntity[];

  @OneToMany(() => DiscountCategoryORMEntity, discountCategory => discountCategory.category)
  discount_Categories: DiscountCategoryORMEntity[];
}
