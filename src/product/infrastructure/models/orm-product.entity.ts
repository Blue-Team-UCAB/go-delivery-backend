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

  @Column()
  price_Producto: number;

  @Column()
  stock_Producto: number;

  @Column()
  weight_Producto: number;

  @Column()
  imagen_Producto: string;
}
