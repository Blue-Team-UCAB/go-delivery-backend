import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '../../domain/repositories/order-repository.interface';
import { DataSource, Repository } from 'typeorm';
import { OrderORMEntity } from '../models/orm-order.entity';
import { OrderMapper } from '../mappers/order.mapper';
import { Result } from '../../../common/domain/result-handler/result';
import { Order } from '../../domain/order';

@Injectable()
export class OrderRepository extends Repository<OrderORMEntity> implements IOrderRepository {
  private readonly orderMapper: OrderMapper;

  constructor(dataSource: DataSource) {
    super(OrderORMEntity, dataSource.createEntityManager());
    this.orderMapper = new OrderMapper();
  }

  async findOrderById(id: string): Promise<Result<Order>> {
    try {
      const order = await this.createQueryBuilder('order')
        .select([
          'order.id_Order',
          'order.state_Order',
          'order.createdDate_Order',
          'order.receiveDate_Order',
          'order.totalAmount_Order',
          'order.subtotalAmount_Order',
          'order.direction_Order',
          'order.longitude_Order',
          'order.latitude_Order',
          'order.claimDate_Order',
          'order.claim_Order',
          'customer_Orders.id_Costumer',
          'courier_Orders.id',
          'courier_Orders.name',
          'courier_Orders.phone',
          'orderProducts.id',
          'orderProducts.quantity',
          'product.id_Product',
          'product.name_Product',
          'product.price_Product',
          'product.weight_Product',
          'product.image_Product',
          'orderBundles.id',
          'orderBundles.quantity',
          'bundle.id',
          'bundle.name',
          'bundle.price',
          'bundle.weight',
          'bundle.imageUrl',
        ])
        .leftJoinAndSelect('order.customer_Orders', 'customer_Orders')
        .leftJoinAndSelect('order.courier_Orders', 'courier_Orders')
        .leftJoinAndSelect('order.order_Products', 'orderProducts')
        .leftJoinAndSelect('orderProducts.product', 'product')
        .leftJoinAndSelect('order.order_Bundles', 'orderBundles')
        .leftJoinAndSelect('orderBundles.bundle', 'bundle')
        .where('order.id_Order = :id', { id })
        .getOne();

      if (!order) {
        return Result.fail(null, 404, 'No existe la orden solicitada');
      }

      const resp = await this.orderMapper.fromPersistenceToDomain(order, true);
      return Result.success<Order>(resp, 200);
    } catch (e) {
      return Result.fail(null, 500, e.message);
    }
  }

  async findAllOrders(page: number, perpage: number, state?: string): Promise<Result<Order[]>> {
    try {
      const skip = perpage * (page - 1);
      const query = this.createQueryBuilder('order')
        .select([
          'order.id_Order',
          'order.state_Order',
          'order.createdDate_Order',
          'order.receiveDate_Order',
          'order.totalAmount_Order',
          'order.subtotalAmount_Order',
          'order.direction_Order',
          'order.longitude_Order',
          'order.latitude_Order',
          'order.claimDate_Order',
          'order.claim_Order',
          'customer_Orders.id_Costumer',
          'courier_Orders.id',
          'courier_Orders.name',
          'courier_Orders.phone',
        ])
        .leftJoinAndSelect('order.customer_Orders', 'customer_Orders')
        .leftJoinAndSelect('order.courier_Orders', 'courier_Orders')
        .skip(skip)
        .take(perpage);

      if (state) {
        query.andWhere('order.state_Order = :state', { state });
      }

      const orders = await query.getMany();

      const resp = await Promise.all(orders.map(order => this.orderMapper.fromPersistenceToDomain(order, false)));
      return Result.success<Order[]>(resp, 200);
    } catch (e) {
      return Result.fail(null, 500, e.message);
    }
  }

  async saveOrderAggregate(order: Order): Promise<Result<Order>> {
    try {
      const orderORM = await this.orderMapper.fromDomainToPersistence(order);
      await this.save(orderORM);
      return Result.success<Order>(order, 200);
    } catch (error) {
      return Result.fail<Order>(new Error(error.message), error.code, error.message);
    }
  }
}
