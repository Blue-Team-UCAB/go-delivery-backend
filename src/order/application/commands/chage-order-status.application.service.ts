import { IApplicationService } from 'src/common/application/application-services/application-service.interface';
import { Result } from '../../../common/domain/result-handler/result';
import { OrderState, OrderStates } from '../../domain/value-objects/order-state';
import { ChangeOrderStatusEntryDto } from '../dto/entry/change-order-status.entry.dto';
import { ChangeOrderStatuResponseDto } from '../dto/response/change-order-status.response.dto';
import { IOrderRepository } from 'src/order/domain/repositories/order-repository.interface';
import { DomainEventBase } from 'src/common/domain/domain-event';
import { IPublisher } from 'src/common/application/events/eventPublisher.interface';
import { ORDER_STATUS_CHANGE_EVENT } from '../../domain/events/order-status-change.event';
import { ICourierRepository } from '../repositories/courier-repository.interface';
import { OrderCourierId } from 'src/order/domain/value-objects/order-courier.id';
import { OrderCourierPhone } from 'src/order/domain/value-objects/order-courier-phone';
import { OrderCourierName } from 'src/order/domain/value-objects/order-courier-name';
import { ICustomerRepository } from 'src/customer/domain/repositories/customer-repository.interface';
import { IUserRepository } from 'src/auth/application/repository/user-repository.interface';

export class ChangeOrderStatusApplicationService implements IApplicationService<ChangeOrderStatusEntryDto, ChangeOrderStatuResponseDto> {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly publisher: IPublisher<DomainEventBase>,
    private readonly courierRepository: ICourierRepository,
    private readonly costumerRepository: ICustomerRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(data: ChangeOrderStatusEntryDto): Promise<Result<ChangeOrderStatuResponseDto>> {
    if (data.status === OrderStates.CANCELLED) {
      return Result.fail<ChangeOrderStatuResponseDto>(null, 400, 'Invalid status');
    }

    const orderResult = await this.orderRepository.findOrderById(data.orderId);

    if (!orderResult.isSuccess()) {
      return Result.fail<ChangeOrderStatuResponseDto>(null, orderResult.StatusCode, orderResult.Message);
    }

    if (!OrderStates[data.status]) {
      return Result.fail<ChangeOrderStatuResponseDto>(null, 400, 'Invalid status');
    }

    const order = orderResult.Value;
    const newStatus = OrderState.create(OrderStates[data.status], new Date());

    order.changeStatus(newStatus);

    let randomCourier = null;

    if (data.status === OrderStates.SHIPPED) {
      const courier = await this.courierRepository.findAllCourier();
      if (!courier.isSuccess()) {
        return Result.fail<ChangeOrderStatuResponseDto>(null, courier.StatusCode, courier.Message);
      }
      const random = Math.floor(Math.random() * courier.Value.length);
      randomCourier = courier.Value[random];
      order.assignCourier(OrderCourierId.create(randomCourier.id), OrderCourierName.create(randomCourier.name), OrderCourierPhone.create(randomCourier.phone));
    }

    const update = await this.orderRepository.updateOrderStatus(order.Id.Id, newStatus.State, newStatus.Date, randomCourier ? randomCourier.id : null);
    if (!update.isSuccess()) {
      return Result.fail<ChangeOrderStatuResponseDto>(null, update.StatusCode, update.Message);
    }

    const customer = await this.costumerRepository.findById(order.CustomerId.Id);

    if (!customer.isSuccess()) {
      return Result.fail<ChangeOrderStatuResponseDto>(null, 500, 'Internal server error');
    }

    const user = await this.userRepository.getById(customer.Value.Id.Id);

    if (!user.getAssigned()) {
      return Result.fail<ChangeOrderStatuResponseDto>(null, 500, 'Internal server error');
    }

    const linkedDivices = user.getValue().linkedDivices;

    const event = order.getDomainEvents();

    const rest = {
      idOrder: event['id'],
      state: event['state'],
      linkedDivices: linkedDivices,
    };

    await this.publisher.publish(ORDER_STATUS_CHANGE_EVENT, { name: event.getEventName, timestamp: event.getOcurredOn, data: rest });
    return Result.success<ChangeOrderStatuResponseDto>({ status: data.status }, 200);
  }
}
