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
import { IPaymentRepository } from 'src/payment/domain/repositories/payment-repository.interface';
import { Payment } from 'src/payment/domain/payment';
import { IdGenerator } from 'src/common/application/id-generator/id-generator.interface';
import { PaymentId } from 'src/payment/domain/value-objects/payment-Id';
import { PaymentName } from 'src/payment/domain/value-objects/payment-name';
import { PaymentDate } from 'src/payment/domain/value-objects/payment-date';
import { PaymentReference } from 'src/payment/domain/value-objects/payment-reference';
import { CustomerId } from 'src/customer/domain/value-objects/customer-id';
import { PaymentAmount } from 'src/payment/domain/value-objects/payment-amount';

export class CancelOrderApplicationService implements IApplicationService<CancelOrderEntryDto, CancelOrderResponseDto> {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly stripeService: IStripeService,
    private readonly costumerRepository: ICustomerRepository,
    private readonly walletRepository: IWalletRepository,
    private readonly paymentRepository: IPaymentRepository,
    private readonly idGenerator: IdGenerator<string>,
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
      const id = await this.idGenerator.generateId();

      const payment = new Payment(
        PaymentId.create(id),
        PaymentName.create('Refund'),
        PaymentDate.create(new Date()),
        PaymentAmount.create(order.Value.TotalAmount.Amount),
        PaymentReference.create(order.Value.Id.Id),
        CustomerId.create(data.idCustomer),
      );

      const pay = await this.paymentRepository.savePayment(payment);

      if (!pay.isSuccess()) {
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
