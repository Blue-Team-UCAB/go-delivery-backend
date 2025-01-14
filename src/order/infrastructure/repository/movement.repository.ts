import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { OrderCourierMovementORMEntity } from '../models/orm-order-courier-movement.entity';

@Injectable()
export class MovementRepository extends Repository<OrderCourierMovementORMEntity> {
  constructor(dataSource: DataSource) {
    super(OrderCourierMovementORMEntity, dataSource.createEntityManager());
  }

  async saveMovement(movement: OrderCourierMovementORMEntity): Promise<void> {
    try {
      await this.save(movement);
    } catch (error) {
      console.log(error);
    }
  }

  async findMovementByOrderId(orderId: string): Promise<OrderCourierMovementORMEntity> {
    try {
      return await this.createQueryBuilder('movement').where('movement.orders = :orderId', { orderId }).getOne();
    } catch (error) {
      console.log(error);
    }
  }
}
