import { DomainEvent } from 'src/common/domain/domain-event';
import { OrderId } from '../value-objects/order.id';
import { OrderState } from '../value-objects/order-state';

export const ORDER_STATUS_CHANGE_EVENT = 'OrderStatusChangeEvent';

export class OrderStatusChangeEvent extends DomainEvent {
  protected constructor(
    public id: OrderId,
    public state: OrderState,
  ) {
    super();
  }

  static create(id: OrderId, state: OrderState): OrderStatusChangeEvent {
    return new OrderStatusChangeEvent(id, state);
  }
}
