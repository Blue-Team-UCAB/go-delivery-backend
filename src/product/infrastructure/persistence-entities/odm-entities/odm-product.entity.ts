import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  codigo_cancion: string;

  @Column()
  nombre_cancion: string;
}
