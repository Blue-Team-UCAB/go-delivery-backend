import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Producto')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  idProducto: string;

  @Column()
  ProductoNombre: string;
}
