import { DomainEvent } from '../../../common/domain/domain-event';
import { OrderBundle } from '../entities/order-bundle';
import { OrderCourier } from '../entities/order-courier';
import { OrderProduct } from '../entities/order-product';
import { OrderCreatedDate } from '../value-objects/order-created-date';
import { OrderDirection } from '../value-objects/order-direction';
import { OrderReport } from '../value-objects/order-report';
import { OrderState } from '../value-objects/order-state';
import { OrderSubtotalAmount } from '../value-objects/order-subtotal-amount';
import { OrderTotalAmount } from '../value-objects/order-total-amount';
import { OrderId } from '../value-objects/order.id';

export class OrderCreatedEvent extends DomainEvent {
  protected constructor(
    public id: OrderId,
    public state: OrderState,
    public createdDate: OrderCreatedDate,
    public totalAmount: OrderTotalAmount,
    public subtotalAmount: OrderSubtotalAmount,
    public direction: OrderDirection,
    public courier: OrderCourier,
    public report: OrderReport,
    public products: OrderProduct[],
    public bundles: OrderBundle[],
  ) {
    super();
  }

  static create(
    id: OrderId,
    state: OrderState,
    createdDate: OrderCreatedDate,
    totalAmount: OrderTotalAmount,
    subtotalAmount: OrderSubtotalAmount,
    direction: OrderDirection,
    courier: OrderCourier,
    report: OrderReport,
    products: OrderProduct[],
    bundles: OrderBundle[],
  ): OrderCreatedEvent {
    return new OrderCreatedEvent(id, state, createdDate, totalAmount, subtotalAmount, direction, courier, report, products, bundles);
  }
}
