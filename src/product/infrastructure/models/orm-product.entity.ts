import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Producto')
export class ProductORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id_Producto: string;

  @Column()
  nombre_Producto: string;

  @Column()
  descripcion_Producto: string;

  @Column()
  currency_Producto: string;

  @Column('float')
  price_Producto: number;

  @Column('float')
  stock_Producto: number;

  @Column('float')
  weight_Producto: number;

  @Column()
  imagen_Producto: string;

  @Column('text', {
    array: true,
    default: [],
  })
  categories_Producto: string[];
}
