import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('PaymentMethod')
export class PaymentMethodORMEntity {
  @PrimaryGeneratedColumn('uuid')
  id_PaymentMethod: string;

  @Column()
  name_PaymentMethod: string;

  @Column()
  state_PaymentMethod: boolean;

  @Column()
  image_PaymentMethod: string;
}
