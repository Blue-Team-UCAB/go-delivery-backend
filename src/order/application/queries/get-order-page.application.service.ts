import { Injectable } from '@nestjs/common';
import { IApplicationService } from '../../../common/application/application-services/application-service.interface';
import { IOrderRepository } from '../../domain/repositories/order-repository.interface';
import { GetOrderPageServiceEntryDto } from '../dto/entry/get-order-page-service.entry.dto';
import { GetOrderPageServiceResponseDto } from '../dto/response/get-order-page-service.response.dto';
import { Result } from '../../../common/domain/result-handler/result';
import { Order } from '../../domain/order';

@Injectable()
export class GetOrderByPageApplicationService implements IApplicationService<GetOrderPageServiceEntryDto, GetOrderPageServiceResponseDto> {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(data: GetOrderPageServiceEntryDto): Promise<Result<GetOrderPageServiceResponseDto>> {
    const orderResult: Result<Order[]> = await this.orderRepository.findAllOrders(data.page, data.perpage, data.id_customer, data.status);

    if (!orderResult.isSuccess) {
      return Result.fail<GetOrderPageServiceResponseDto>(orderResult.Error, orderResult.StatusCode, orderResult.Message);
    }

    const orders = orderResult.Value.map(order => {
      const summaryOrder = [
        ...order.Products.map(product => `${product.Name.Name} (${product.Quantity.Quantity})`),
        ...order.Bundles.map(bundle => `${bundle.Name.Name} (${bundle.Quantity.Quantity})`),
      ].join(', ');

      const lastState = order.StateHistory[order.StateHistory.length - 1];

      return {
        id: order.Id.Id,
        last_state: {
          state: lastState.State,
          date: lastState.Date,
        },
        totalAmount: order.TotalAmount.Amount,
        summary_order: summaryOrder,
      };
    });

    return Result.success<GetOrderPageServiceResponseDto>({ orders }, 200);
  }
}
