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
  imagen_Producto: string;
}
