import { IApplicationService } from 'src/common/application/application-services/application-service.interface';
import { CancelOrderEntryDto } from '../dto/entry/cancel-oder.entry.dto';
import { CancelOrderResponseDto } from '../dto/response/cancel-order.response.dto';
import { Result } from 'src/common/domain/result-handler/result';
import { IOrderRepository } from 'src/order/domain/repositories/order-repository.interface';
import { IStripeService } from 'src/common/application/stripe-service/stripe-service.interface';
import { ICustomerRepository } from 'src/customer/domain/repositories/customer-repository.interface';
import { IWalletRepository } from 'src/customer/domain/repositories/wallet-repository.interface';
import { OrderReport } from 'src/order/domain/value-objects/order-report';
import { CancelOrderApplicationService } from './cancel-oder.application.service';
import { ReportOrderEntryDto } from '../dto/entry/report-oder.entry.dto';
import { IPaymentRepository } from 'src/payment/domain/repositories/payment-repository.interface';
import { IdGenerator } from 'src/common/application/id-generator/id-generator.interface';

export class ReportOrderApplicationService implements IApplicationService<ReportOrderEntryDto, CancelOrderResponseDto> {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly stripeService: IStripeService,
    private readonly customerRepository: ICustomerRepository,
    private readonly walletRepository: IWalletRepository,
    private readonly paymentRepository: IPaymentRepository,
    private readonly idGenerator: IdGenerator<string>,
  ) {}

  async execute(data: ReportOrderEntryDto): Promise<Result<CancelOrderResponseDto>> {
    const orden = await this.orderRepository.findOrderById(data.orderId);

    if (!orden.isSuccess()) {
      return Result.fail<CancelOrderResponseDto>(orden.Error, orden.StatusCode, orden.Message);
    }

    const service = new CancelOrderApplicationService(this.orderRepository, this.stripeService, this.customerRepository, this.walletRepository, this.paymentRepository, this.idGenerator);
    const res = await service.execute(data);

    if (!res.isSuccess()) {
      return Result.fail<CancelOrderResponseDto>(res.Error, res.StatusCode, res.Message);
    }

    orden.Value.reportOrder(OrderReport.create(new Date(), data.description));

    const result = await this.orderRepository.updateOrderReport(orden.Value.Id.Id, orden.Value.Report.ClaimDate, orden.Value.Report.Claim);

    if (!result.isSuccess()) {
      return Result.fail<CancelOrderResponseDto>(result.Error, result.StatusCode, result.Message);
    }

    return Result.success<CancelOrderResponseDto>('Order reported successfully', 200);
  }
}
