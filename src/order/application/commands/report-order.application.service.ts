import { IApplicationService } from 'src/common/application/application-services/application-service.interface';
import { CancelOrderEntryDto } from '../dto/entry/cancel-oder.entry.dto';
import { CancelOrderResponseDto } from '../dto/response/cancel-order.response.dto';
import { Result } from 'src/common/domain/result-handler/result';
import { IOrderRepository } from 'src/order/domain/repositories/order-repository.interface';
import { IStripeService } from 'src/common/application/stripe-service/stripe-service.interface';
import { ICustomerRepository } from 'src/customer/domain/repositories/customer-repository.interface';
import { IWalletRepository } from 'src/customer/domain/repositories/wallet-repository.interface';
import { OrderReport } from 'src/order/domain/value-objects/order-report';
import { ReportOrderEntryDto } from '../dto/entry/report-oder.entry.dto';
import { IPaymentRepository } from 'src/payment/domain/repositories/payment-repository.interface';
import { IdGenerator } from 'src/common/application/id-generator/id-generator.interface';
import { OrderStates } from 'src/order/domain/value-objects/order-state';

export class ReportOrderApplicationService implements IApplicationService<ReportOrderEntryDto, CancelOrderResponseDto> {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(data: ReportOrderEntryDto): Promise<Result<CancelOrderResponseDto>> {
    const orden = await this.orderRepository.findOrderById(data.orderId);

    if (!orden.isSuccess()) {
      return Result.fail<CancelOrderResponseDto>(orden.Error, orden.StatusCode, orden.Message);
    }

    const existeCancelado = orden.Value.StateHistory.some(x => x.State === OrderStates.CANCELLED);

    if (!existeCancelado) {
      return Result.fail<CancelOrderResponseDto>(null, 400, 'Order has not been cancelled');
    }

    orden.Value.reportOrder(OrderReport.create(new Date(), data.description));

    const result = await this.orderRepository.updateOrderReport(orden.Value.Id.Id, orden.Value.Report.ClaimDate, orden.Value.Report.Claim);

    if (!result.isSuccess()) {
      return Result.fail<CancelOrderResponseDto>(result.Error, result.StatusCode, result.Message);
    }

    return Result.success<CancelOrderResponseDto>('Order reported successfully', 200);
  }
}
