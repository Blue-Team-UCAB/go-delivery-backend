import { Injectable } from '@nestjs/common';
import { IApplicationService } from '../../../common/application/application-services/application-service.interface';
import { GetOrderIdServiceEntryDto } from '../dto/entry/get-order-id-service.entry.dto';
import { CourierDto, DirectionDto, GetOrderIdServiceResponseDto, OrderReportDto, ProductBundleDto } from '../dto/response/get-order-id-service.response.dto';
import { IOrderRepository } from '../../domain/repositories/order-repository.interface';
import { IStorageS3Service } from '../../../common/application/s3-storage-service/s3.storage.service.interface';
import { Result } from '../../../common/domain/result-handler/result';
import { IDateService } from '../../../common/application/date-service/date-service.interface';
import { OrderStates } from 'src/order/domain/value-objects/order-state';

@Injectable()
export class GetOrderByIdApplicationService implements IApplicationService<GetOrderIdServiceEntryDto, GetOrderIdServiceResponseDto> {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly s3Service: IStorageS3Service,
    private readonly dateService: IDateService,
  ) {}

  async execute(data: GetOrderIdServiceEntryDto): Promise<Result<GetOrderIdServiceResponseDto>> {
    const orderResult = await this.orderRepository.findOrderById(data.id);

    if (!orderResult.isSuccess) {
      return Result.fail<GetOrderIdServiceResponseDto>(orderResult.Error, orderResult.StatusCode, orderResult.Message);
    }

    const order = orderResult.Value;

    const products: ProductBundleDto[] = await Promise.all(
      order.Products.map(async product => {
        const imageUrlProduct = await this.s3Service.getFile(product.Image.Url);
        return {
          id: product.Id.Id,
          name: product.Name.Name,
          description: 'Este producto es increiblemente bueno',
          quantity: product.Quantity.Quantity,
          price: product.Price.Price,
          images: [imageUrlProduct],
          currency: 'USD',
        };
      }),
    );

    const bundles: ProductBundleDto[] = await Promise.all(
      order.Bundles.map(async bundle => {
        const imageUrlBundle = await this.s3Service.getFile(bundle.Image.Url);
        return {
          id: bundle.Id.Id,
          name: bundle.Name.Name,
          description: 'Este bundle es increiblemente bueno',
          quantity: bundle.Quantity.Quantity,
          price: bundle.Price.Price,
          images: [imageUrlBundle],
          currency: 'USD',
        };
      }),
    );

    const stateHistory = await Promise.all(
      order.StateHistory.map(async state => ({
        state: state.State,
        date: await this.dateService.toUtcMinus4(state.Date),
      })),
    );

    const courier: CourierDto | null = order.Courier
      ? {
          courierName: order.Courier.Name.Name,
          phone: order.Courier.Phone.Phone,
          courierImage: await this.s3Service.getFile(order.Courier.Image.Url),
        }
      : undefined;

    const direction: DirectionDto | null = {
      lat: order.Direction.Longitude,
      long: order.Direction.Latitude,
    };

    const report: OrderReportDto | null = order.Report
      ? {
          description: order.Report.Claim,
        }
      : undefined;

    let receivedDate: Date | null;
    const lastState = order.StateHistory[order.StateHistory.length - 1];
    if (lastState.State === OrderStates.SHIPPED) {
      receivedDate = lastState.Date;
    }

    const response: GetOrderIdServiceResponseDto = {
      orderId: order.Id.Id,
      orderState: stateHistory,
      orderTimeCreated: order.CreatedDate.CreatedDate.toLocaleTimeString(),
      totalAmount: order.TotalAmount.Amount,
      subTotal: order.SubtotalAmount.Amount,
      orderReceivedDate: receivedDate,
      orderPayment: {
        paymetAmount: order.TotalAmount.Amount,
        paymentCurrency: 'USD',
        paymentMethod: 'Wallet',
      },
      orderDirection: direction,
      orderReport: report,
      orderCourier: courier,
      products: products,
      bundles: bundles,
    };

    return Result.success<GetOrderIdServiceResponseDto>(response, 200);
  }
}
