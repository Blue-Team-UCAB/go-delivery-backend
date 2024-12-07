import { IApplicationService } from 'src/common/application/application-services/application-service.interface';
import { Result } from 'src/common/domain/result-handler/result';
import { CancelOrderEntryDto } from '../dto/entry/cancel-oder.entry.dto';
import { CancelOrderResponseDto } from '../dto/response/cancel-order.response.dto';
import { IOrderRepository } from '../../domain/repositories/order-repository.interface';
import { OrderState, OrderStates } from 'src/order/domain/value-objects/order-state';
import { IStripeService } from 'src/common/application/stripe-service/stripe-service.interface';
import { ICustomerRepository } from 'src/customer/domain/repositories/customer-repository.interface';
import { WalletAmount } from 'src/customer/domain/value-objects/wallet-amount';
import { IWalletRepository } from 'src/customer/domain/repositories/wallet-repository.interface';

export class CancelOrderApplicationService implements IApplicationService<CancelOrderEntryDto, CancelOrderResponseDto> {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly stripeService: IStripeService,
    private readonly costumerRepository: ICustomerRepository,
    private readonly walletRepository: IWalletRepository,
  ) {}
  async execute(data: CancelOrderEntryDto): Promise<Result<CancelOrderResponseDto>> {
    const order = await this.orderRepository.findOrderById(data.orderId);

    if (!order.isSuccess()) {
      return Result.fail<CancelOrderResponseDto>(null, 500, 'Internal Server Error');
    }

    const states = order.Value.StateHistory;

    if (states.find(state => state.State === OrderStates.CANCELLED || state.State === OrderStates.DELIVERED || state.State === OrderStates.IN_PROCESS || state.State === OrderStates.SHIPPED)) {
      return Result.fail<CancelOrderResponseDto>(null, 400, 'Order cannot be cancelled');
    }

    const stripeResponse = await this.stripeService.refundPayment(data.orderId, data.idStripe);

    if (!stripeResponse) {
      const constumer = await this.costumerRepository.findById(data.idCustomer);

      if (!constumer.isSuccess()) {
        return Result.fail<CancelOrderResponseDto>(null, 500, 'Internal Server Error');
      }

      constumer.Value.sumWallet(WalletAmount.create(order.Value.TotalAmount.Amount));

      const cust = await this.walletRepository.saveWallet(constumer.Value.Wallet);

      if (!cust.isSuccess()) {
        return Result.fail<CancelOrderResponseDto>(null, 500, 'Internal Server Error');
      }
    }

    const newStatus = OrderState.create(OrderStates.CANCELLED, new Date());
    order.Value.changeStatus(newStatus);
    const updateOrder = await this.orderRepository.updateOrderStatus(order.Value.Id.Id, newStatus.State, newStatus.Date, null);

    if (!updateOrder.isSuccess()) {
      return Result.fail<CancelOrderResponseDto>(null, 500, 'Internal Server Error');
    }

    return Result.success<CancelOrderResponseDto>('Order Cancelled', 200);
  }
}
