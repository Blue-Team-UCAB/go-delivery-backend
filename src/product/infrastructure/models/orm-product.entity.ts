import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BundleProductORMEntity } from '../../../bundle/infrastructure/models/orm-bundle-product.entity';
import { ProductCategoryORMEntity } from './orm-product-category.entity';
import { OrderProductORMEntity } from '../../../order/infrastructure/models/orm-order-product.entity';
import { DiscountProductORMEntity } from '../../../discount/infrastructure/models/orm-discount-product';

@Entity('Product')
export class ProductORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id_Product: string;

  @Column()
  name_Product: string;

  @Column()
  description_Product: string;

  @Column()
  currency_Product: string;

  @Column('float')
  price_Product: number;

  @Column('float')
  stock_Product: number;

  @Column('float')
  weight_Product: number;

  @Column()
  measurement_Product: string;

  @Column()
  image_Product: string;

  @OneToMany(() => BundleProductORMEntity, bundleProduct => bundleProduct.product)
  bundleProducts: BundleProductORMEntity[];

  @OneToMany(() => ProductCategoryORMEntity, productCategory => productCategory.product)
  product_Categories: ProductCategoryORMEntity[];

  @OneToMany(() => OrderProductORMEntity, orderProduct => orderProduct.product, { cascade: true })
  order_Products: OrderProductORMEntity[];

  @OneToMany(() => DiscountProductORMEntity, discountProduct => discountProduct.product)
  discount_Products: DiscountProductORMEntity[];
}
