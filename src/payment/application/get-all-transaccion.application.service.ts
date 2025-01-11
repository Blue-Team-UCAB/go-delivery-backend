import { IApplicationService } from 'src/common/application/application-services/application-service.interface';
import { GetAllTransaccionEntryDto } from './dto/entry/get-all-transaccion.entry.dto';
import { GetAllTransaccionResponseDto } from './dto/response/get-all-transaccion.response.dto';
import { Result } from 'src/common/domain/result-handler/result';
import { IPaymentRepository } from '../domain/repositories/payment-repository.interface';
import { IStripeService } from 'src/common/application/stripe-service/stripe-service.interface';
import { IOrderRepository } from 'src/order/domain/repositories/order-repository.interface';
import { Order } from 'src/order/domain/order';
import { Payment } from '../domain/payment';

export class GetAllPaymentsApplicationService implements IApplicationService<GetAllTransaccionEntryDto, GetAllTransaccionResponseDto[]> {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly orderRepository: IOrderRepository,
    private readonly stripeService: IStripeService,
  ) {}

  async execute(data: GetAllTransaccionEntryDto): Promise<Result<GetAllTransaccionResponseDto[]>> {
    const payments = await this.paymentRepository.getPayments(data.idCustomer);

    if (!payments.isSuccess()) {
      return Result.fail<GetAllTransaccionResponseDto[]>(null, 400, 'Payments not found');
    }

    const orders = await this.orderRepository.findAllOrders(1, 100, data.idCustomer);

    if (!orders.isSuccess()) {
      return Result.fail<GetAllTransaccionResponseDto[]>(null, 400, 'Orders not found');
    }

    const response: GetAllTransaccionResponseDto[] = [];

    const paymentsRefund: Payment[] = [];

    for (const payment of payments.Value) {
      if (payment.Name.Name === 'Refund') {
        paymentsRefund.push(payment);
      }
    }

    for (const payment of paymentsRefund) {
      response.push({
        type: `Devolucion de la orden #${payment.Reference.Reference.slice(-5)}`,
        date: payment.Date.Date,
        amount: payment.Amount.Amount,
        method: 'Cartera',
        debit: true,
      });
    }

    const paymentsNotRefund: Payment[] = [];

    for (const payment of payments.Value) {
      if (payment.Name.Name !== 'Refund') {
        paymentsNotRefund.push(payment);
      }
    }

    for (const payment of paymentsNotRefund) {
      response.push({
        type: 'Recargaste tu Wallet',
        date: payment.Date.Date,
        amount: payment.Amount.Amount,
        method: payment.Name.Name,
        debit: true,
      });
    }

    const ordersNotRefundWithStripe = await this.stripeService.getOrdersNotRefundWithStripe(data.idStripe);

    const ordersNotRefundStripe: Order[] = [];

    for (const order of orders.Value) {
      if (ordersNotRefundWithStripe.includes(order.Id.Id)) {
        ordersNotRefundStripe.push(order);
      }
    }

    const ordersRefundWithStripe = await this.stripeService.getOrdersRefundWithStripe(data.idStripe);

    const ordersRefundStripe: Order[] = [];

    for (const order of orders.Value) {
      if (ordersRefundWithStripe.includes(order.Id.Id)) {
        ordersRefundStripe.push(order);
      }
    }

    for (const order of ordersNotRefundStripe) {
      response.push({
        type: `Pagaste la orden #${order.Id.Id.slice(-5)}`,
        date: order.CreatedDate.CreatedDate,
        amount: -order.TotalAmount.Amount,
        method: 'Tarjeta de Crédito',
        debit: false,
      });
    }

    for (const order of ordersRefundStripe) {
      response.push({
        type: `Devolucion de la orden #${order.Id.Id.slice(-5)}`,
        date: order.CreatedDate.CreatedDate,
        amount: order.TotalAmount.Amount,
        method: 'Tarjeta de Crédito',
        debit: true,
      });
    }

    const OrdersWithWallet: Order[] = [];

    for (const order of orders.Value) {
      if (!ordersRefundWithStripe.includes(order.Id.Id) && !ordersNotRefundWithStripe.includes(order.Id.Id)) {
        OrdersWithWallet.push(order);
      }
    }

    for (const order of OrdersWithWallet) {
      response.push({
        type: `Pagaste la orden #${order.Id.Id.slice(-5)}`,
        date: order.CreatedDate.CreatedDate,
        amount: -order.TotalAmount.Amount,
        method: 'Wallet',
        debit: false,
      });
    }

    const SortedResponse = response.sort((a, b) => {
      return a.date < b.date ? 1 : -1;
    });

    return Result.success<GetAllTransaccionResponseDto[]>(SortedResponse, 200);
  }
}
