import { Result } from 'src/common/domain/result-handler/result';
import { Order } from '../order';

export interface IOrderRepository {
  findOrderById(id: string): Promise<Result<Order>>;
  findAllOrders(page: number, perpage: number, idCustomer: string, state?: 'active' | 'past'): Promise<Result<Order[]>>;
  saveOrderAggregate(order: Order): Promise<Result<Order>>;
  updateOrderStatus(id: string, status: string, date: Date, courier: string | null): Promise<Result<boolean>>;
  updateOrderReport(id: string, date: Date, report: string): Promise<Result<boolean>>;
}
