import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '../../domain/repositories/order-repository.interface';
import { DataSource, Repository } from 'typeorm';
import { OrderORMEntity } from '../models/orm-order.entity';
import { OrderMapper } from '../mappers/order.mapper';
import { Result } from '../../../common/domain/result-handler/result';
import { Order } from '../../domain/order';
import { OrderStateHistoryORMEntity } from '../models/orm-order-state.entity';
import { OrderCourierORMEntity } from '../models/orm-order-courier.entity';

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
          'order.createdDate_Order',
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
          'orderStateHistory.id',
          'orderStateHistory.state',
          'orderStateHistory.date',
        ])
        .leftJoinAndSelect('order.customer_Orders', 'customer_Orders')
        .leftJoinAndSelect('order.courier_Orders', 'courier_Orders')
        .leftJoinAndSelect('order.order_Products', 'orderProducts')
        .leftJoinAndSelect('orderProducts.product', 'product')
        .leftJoinAndSelect('order.order_Bundles', 'orderBundles')
        .leftJoinAndSelect('orderBundles.bundle', 'bundle')
        .leftJoinAndSelect('order.order_StateHistory', 'orderStateHistory')
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

  async findAllOrders(page: number, perpage: number, idCustomer: string, state?: 'active' | 'past'): Promise<Result<Order[]>> {
    try {
      const skip = perpage * page - perpage;
      const query = this.createQueryBuilder('order')
        .select([
          'order.id_Order',
          'order.createdDate_Order',
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
          'orderStateHistory.id',
          'orderStateHistory.state',
          'orderStateHistory.date',
        ])
        .leftJoinAndSelect('order.customer_Orders', 'customer_Orders')
        .leftJoinAndSelect('order.courier_Orders', 'courier_Orders')
        .leftJoinAndSelect('order.order_Products', 'orderProducts')
        .leftJoinAndSelect('orderProducts.product', 'product')
        .leftJoinAndSelect('order.order_Bundles', 'orderBundles')
        .leftJoinAndSelect('orderBundles.bundle', 'bundle')
        .leftJoinAndSelect('order.order_StateHistory', 'orderStateHistory')
        .where('customer_Orders.id_Costumer = :idCustomer', { idCustomer })
        .skip(skip)
        .take(perpage);

      if (state === 'active') {
        query.andWhere('orderStateHistory.state NOT IN (:...states)', { states: ['DELIVERED', 'CANCELLED'] });
      } else if (state === 'past') {
        query.andWhere('orderStateHistory.state IN (:...states)', { states: ['DELIVERED', 'CANCELLED'] });
      }

      const orders = await query.getMany();
      const resp = await Promise.all(orders.map(order => this.orderMapper.fromPersistenceToDomain(order, true)));
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

  async updateOrderStatus(id: string, status: string, date: Date, courierAsign: string | null): Promise<Result<boolean>> {
    try {
      const order = await this.findOne({ where: { id_Order: id }, relations: ['order_StateHistory'] });

      if (!order) {
        return Result.fail<boolean>(null, 404, 'No existe la orden solicitada');
      }

      const existingState = order.order_StateHistory.find(state => state.state === status);

      if (existingState) {
        return Result.fail<boolean>(null, 400, 'El estado ya existe');
      }

      if (courierAsign) {
        order.courier_Orders = { id: courierAsign } as OrderCourierORMEntity;
      }
      const newStateHistory = new OrderStateHistoryORMEntity();

      newStateHistory.state = status;
      newStateHistory.date = date;
      order.order_StateHistory.push(newStateHistory);
      await this.save(order);
      return Result.success<boolean>(true, 200);
    } catch (e) {
      return Result.fail<boolean>(null, 500, e.message);
    }
  }
}
