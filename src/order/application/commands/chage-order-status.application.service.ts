import { IApplicationService } from 'src/common/application/application-services/application-service.interface';
import { Result } from '../../../common/domain/result-handler/result';
import { OrderState, OrderStates } from '../../domain/value-objects/order-state';
import { ChangeOrderStatusEntryDto } from '../dto/entry/change-order-status.entry.dto';
import { ChangeOrderStatuResponseDto } from '../dto/response/change-order-status.response.dto';
import { IOrderRepository } from 'src/order/domain/repositories/order-repository.interface';
import { DomainEventBase } from 'src/common/domain/domain-event';
import { IPublisher } from 'src/common/application/events/eventPublisher.interface';
import { ORDER_STATUS_CHANGE_EVENT } from '../../domain/events/order-status-change.event';

export class ChangeOrderStatusApplicationService implements IApplicationService<ChangeOrderStatusEntryDto, ChangeOrderStatuResponseDto> {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly publisher: IPublisher<DomainEventBase>,
  ) {}

  async execute(data: ChangeOrderStatusEntryDto): Promise<Result<ChangeOrderStatuResponseDto>> {
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

    const update = await this.orderRepository.updateOrderStatus(order.Id.Id, newStatus.State, newStatus.Date);
    if (!update.isSuccess()) {
      return Result.fail<ChangeOrderStatuResponseDto>(null, update.StatusCode, update.Message);
    }

    const event = order.getDomainEvents();

    const rest = {
      idOrder: event['id'],
      state: event['state'],
      linkedDivices: data.linkedDivices,
    };

    await this.publisher.publish(ORDER_STATUS_CHANGE_EVENT, { name: event.getEventName, timestamp: event.getOcurredOn, data: rest });
    return Result.success<ChangeOrderStatuResponseDto>({ status: data.status }, 200);
  }
}
