import { CustomerId } from '../../../customer/domain/value-objects/customer-id';
import { DomainEvent } from '../../../common/domain/domain-event';
import { OrderBundle } from '../entities/order-bundle';
import { OrderProduct } from '../entities/order-product';
import { OrderCreatedDate } from '../value-objects/order-created-date';
import { OrderDirection } from '../value-objects/order-direction';
import { OrderState } from '../value-objects/order-state';
import { OrderSubtotalAmount } from '../value-objects/order-subtotal-amount';
import { OrderTotalAmount } from '../value-objects/order-total-amount';
import { OrderId } from '../value-objects/order.id';
import { OrderCourier } from '../entities/order-courier';
import { OrderReport } from '../value-objects/order-report';

export class OrderCreatedEvent extends DomainEvent {
  protected constructor(
    public id: OrderId,
    public customerId: CustomerId,
    public stateHistory: OrderState[],
    public createdDate: OrderCreatedDate,
    public totalAmount: OrderTotalAmount,
    public subtotalAmount: OrderSubtotalAmount,
    public direction: OrderDirection,
    public products: OrderProduct[],
    public bundles: OrderBundle[],
    public courier: OrderCourier | null,
    public report: OrderReport | null,
  ) {
    super();
  }

  static create(
    id: OrderId,
    customerId: CustomerId,
    stateHistory: OrderState[],
    createdDate: OrderCreatedDate,
    totalAmount: OrderTotalAmount,
    subtotalAmount: OrderSubtotalAmount,
    direction: OrderDirection,
    products: OrderProduct[],
    bundles: OrderBundle[],
    courier: OrderCourier | null,
    report: OrderReport | null,
  ): OrderCreatedEvent {
    return new OrderCreatedEvent(id, customerId, stateHistory, createdDate, totalAmount, subtotalAmount, direction, products, bundles, courier, report);
  }
}
