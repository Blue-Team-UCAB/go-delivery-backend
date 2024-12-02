import { DomainEvent } from '../../common/domain/domain-event';
import { AggregateRoot } from '../../common/domain/aggregate-root';
import { OrderBundle } from './entities/order-bundle';
import { OrderCourier } from './entities/order-courier';
import { OrderProduct } from './entities/order-product';
import { OrderCreatedEvent } from './events/order-created.event';
import { InvalidOrderException } from './exceptions/invalid-order.exception';
import { OrderCreatedDate } from './value-objects/order-created-date';
import { OrderDirection } from './value-objects/order-direction';
import { OrderReceivedDate } from './value-objects/order-received-date';
import { OrderReport } from './value-objects/order-report';
import { OrderState } from './value-objects/order-state';
import { OrderSubtotalAmount } from './value-objects/order-subtotal-amount';
import { OrderTotalAmount } from './value-objects/order-total-amount';
import { OrderId } from './value-objects/order.id';

export class Order extends AggregateRoot<OrderId> {
  private state: OrderState;
  private createdDate: OrderCreatedDate;
  private receiveDate: OrderReceivedDate;
  private totalAmount: OrderTotalAmount;
  private subtotalAmount: OrderSubtotalAmount;
  private direction: OrderDirection;
  private courier: OrderCourier;
  private report: OrderReport;
  private products: OrderProduct[];
  private bundles: OrderBundle[];

  get State(): OrderState {
    return this.state;
  }

  get CreatedDate(): OrderCreatedDate {
    return this.createdDate;
  }

  get ReceiveDate(): OrderReceivedDate {
    return this.receiveDate;
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
    state: OrderState,
    createdDate: OrderCreatedDate,
    totalAmount: OrderTotalAmount,
    subtotalAmount: OrderSubtotalAmount,
    direction: OrderDirection,
    courier: OrderCourier,
    report: OrderReport,
    products: OrderProduct[],
    bundles: OrderBundle[],
  ) {
    const orderCreated = OrderCreatedEvent.create(id, state, createdDate, totalAmount, subtotalAmount, direction, courier, report, products, bundles);
    super(id, orderCreated);
  }

  protected checkValidState(): void {
    if (!this.state || !this.createdDate || !this.totalAmount || !this.subtotalAmount || !this.direction || !this.courier || !this.report || !this.products || !this.bundles) {
      throw new InvalidOrderException(`Order not valid`);
    }
  }

  protected when(event: DomainEvent): void {
    if (event instanceof OrderCreatedEvent) {
      this.state = event.state;
      this.createdDate = event.createdDate;
      this.totalAmount = event.totalAmount;
      this.subtotalAmount = event.subtotalAmount;
      this.direction = event.direction;
      this.courier = event.courier;
      this.report = event.report;
      this.products = event.products;
      this.bundles = event.bundles;
    }
  }
}
