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
          'courier_Orders.image',
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

      const orders = await query.getMany();

      const filteredOrders = orders.map(order => {
        const lastState = order.order_StateHistory?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

        if (!lastState) return null;

        const isActive = lastState.state !== 'CANCELLED' && lastState.state !== 'DELIVERED';
        const isPast = lastState.state === 'CANCELLED' || lastState.state === 'DELIVERED';

        if (!state || (state === 'active' && isActive) || (state === 'past' && isPast)) {
          return {
            ...order,
            order_StateHistory: [
              {
                id: lastState.id,
                state: lastState.state,
                date: lastState.date,
              },
            ],
          };
        }
        return null;
      });

      const finalOrders = filteredOrders.filter(order => order !== null);

      const resp = await Promise.all(
        finalOrders.map(async order => {
          const orderStateHistory = order.order_StateHistory.map(state => {
            const stateHistory = new OrderStateHistoryORMEntity();
            stateHistory.id = state.id;
            stateHistory.state = state.state;
            stateHistory.date = state.date;
            stateHistory.order = order as OrderORMEntity;
            return stateHistory;
          });
          return this.orderMapper.fromPersistenceToDomain({ ...order, order_StateHistory: orderStateHistory }, true);
        }),
      );

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

  async updateOrderReport(id: string, date: Date, report: string): Promise<Result<boolean>> {
    try {
      const order = await this.findOne({ where: { id_Order: id } });

      if (!order) {
        return Result.fail<boolean>(null, 404, 'No existe la orden solicitada');
      }

      order.claimDate_Order = date;
      order.claim_Order = report;

      await this.save(order);
      return Result.success<boolean>(true, 200);
    } catch (e) {
      return Result.fail<boolean>(null, 500, e.message);
    }
  }

  async getCourierParams(id: string): Promise<Result<{ longitude: number; latitude: number; ordenState: string[] }>> {
    try {
      const order = await this.findOne({ where: { id_Order: id }, relations: ['order_StateHistory'] });

      if (!order) {
        return Result.fail<{ longitude: number; latitude: number; ordenState: string[] }>(null, 404, 'No existe la orden solicitada');
      }

      return Result.success<{ longitude: number; latitude: number; ordenState: string[] }>(
        {
          longitude: order.longitude_Order,
          latitude: order.latitude_Order,
          ordenState: order.order_StateHistory.map(state => state.state),
        },
        200,
      );
    } catch (e) {
      return Result.fail<{ longitude: number; latitude: number; ordenState: string[] }>(null, 500, e.message);
    }
  }
}
