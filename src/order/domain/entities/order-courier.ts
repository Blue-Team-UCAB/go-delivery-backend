import { Entity } from '../../../common/domain/entity';
import { OrderCourierName } from '../value-objects/order-courier-name';
import { OrderCourierPhone } from '../value-objects/order-courier-phone';
import { OrderCourierId } from '../value-objects/order-courier.id';

export class OrderCourier extends Entity<OrderCourierId> {
  constructor(
    id: OrderCourierId,
    private readonly name: OrderCourierName,
    private readonly phone: OrderCourierPhone,
  ) {
    super(id);
  }

  get Name(): OrderCourierName {
    return this.name;
  }

  get Phone(): OrderCourierPhone {
    return this.phone;
  }
}
