import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Category')
export class CategoryORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id_Category: string;

  @Column()
  name_Category: string;

  @Column()
  image_Category: string;
}
