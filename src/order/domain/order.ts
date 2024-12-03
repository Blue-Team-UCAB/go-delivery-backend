import { DomainEvent } from '../../common/domain/domain-event';
import { AggregateRoot } from '../../common/domain/aggregate-root';
import { OrderBundle } from './entities/order-bundle';
import { OrderCourier } from './entities/order-courier';
import { OrderProduct } from './entities/order-product';
import { OrderCreatedEvent } from './events/order-created.event';
import { InvalidOrderException } from './exceptions/invalid-order.exception';
import { OrderCreatedDate } from './value-objects/order-created-date';
import { OrderDirection } from './value-objects/order-direction';
import { OrderReport } from './value-objects/order-report';
import { OrderState } from './value-objects/order-state';
import { OrderSubtotalAmount } from './value-objects/order-subtotal-amount';
import { OrderTotalAmount } from './value-objects/order-total-amount';
import { OrderId } from './value-objects/order.id';
import { CustomerId } from '../../customer/domain/value-objects/customer-id';
import { OrderStatusChangeEvent } from './events/order-status-change.event';

export class Order extends AggregateRoot<OrderId> {
  private customerId: CustomerId;
  private stateHistory: OrderState[];
  private createdDate: OrderCreatedDate;
  private totalAmount: OrderTotalAmount;
  private subtotalAmount: OrderSubtotalAmount;
  private direction: OrderDirection;
  private courier: OrderCourier | null;
  private report: OrderReport | null;
  private products: OrderProduct[];
  private bundles: OrderBundle[];

  get CustomerId(): CustomerId {
    return this.customerId;
  }

  get StateHistory(): OrderState[] {
    return this.stateHistory;
  }

  get CreatedDate(): OrderCreatedDate {
    return this.createdDate;
  }

  get TotalAmount(): OrderTotalAmount {
    return this.totalAmount;
  }

  get SubtotalAmount(): OrderSubtotalAmount {
    return this.subtotalAmount;
  }

  get Direction(): OrderDirection {
    return this.direction;
  }

  get Courier(): OrderCourier {
    return this.courier;
  }

  get Report(): OrderReport {
    return this.report;
  }

  get Products(): OrderProduct[] {
    return this.products;
  }

  get Bundles(): OrderBundle[] {
    return this.bundles;
  }

  constructor(
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
  ) {
    const orderCreated = OrderCreatedEvent.create(id, customerId, stateHistory, createdDate, totalAmount, subtotalAmount, direction, products, bundles, courier, report);
    super(id, orderCreated);
  }

  protected checkValidState(): void {
    if (!this.customerId || !this.stateHistory || !this.createdDate || !this.totalAmount || !this.subtotalAmount || !this.direction || !this.products || !this.bundles) {
      throw new InvalidOrderException(`Order not valid`);
    }
  }

  protected when(event: DomainEvent): void {
    if (event instanceof OrderCreatedEvent) {
      this.customerId = event.customerId;
      this.stateHistory = event.stateHistory;
      this.createdDate = event.createdDate;
      this.totalAmount = event.totalAmount;
      this.subtotalAmount = event.subtotalAmount;
      this.direction = event.direction;
      this.products = event.products;
      this.bundles = event.bundles;
      this.courier = event.courier;
      this.report = event.report;
    } else if (event instanceof OrderStatusChangeEvent) {
      this.stateHistory.push(event.state);
    }
  }

  public changeStatus(state: OrderState): void {
    const lastState = OrderStatusChangeEvent.create(this.Id, state);
    this.apply(lastState);
  }
}
