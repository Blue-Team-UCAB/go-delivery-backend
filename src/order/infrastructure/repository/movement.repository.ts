import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { OrderCourierMovementORMEntity } from '../models/orm-order-courier-movement.entity';

@Injectable()
export class MovementRepository extends Repository<OrderCourierMovementORMEntity> {
  constructor(dataSource: DataSource) {
    super(OrderCourierMovementORMEntity, dataSource.createEntityManager());
  }

  async saveMouvement(movement: OrderCourierMovementORMEntity): Promise<void> {
    try {
      await this.save(movement);
    } catch (error) {
      console.log(error);
    }
  }

  async findMovementByOrderId(orderId: string): Promise<OrderCourierMovementORMEntity> {
    throw new Error('Method not implemented.');
  }
}
