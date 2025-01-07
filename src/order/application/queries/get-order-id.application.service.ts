import { Injectable } from '@nestjs/common';
import { IApplicationService } from '../../../common/application/application-services/application-service.interface';
import { GetOrderIdServiceEntryDto } from '../dto/entry/get-order-id-service.entry.dto';
import { GetOrderIdServiceResponseDto, CourierDto, OrderReportDto, StateHistoryDto, DirectionDto, ProductBundleDto } from '../dto/response/get-order-id-service.response.dto';
import { IOrderRepository } from '../../domain/repositories/order-repository.interface';
import { IStorageS3Service } from '../../../common/application/s3-storage-service/s3.storage.service.interface';
import { Result } from '../../../common/domain/result-handler/result';
import { IDateService } from '../../../common/application/date-service/date-service.interface';

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
          price: product.Price.Price,
          quantity: product.Quantity.Quantity,
          imageUrl: imageUrlProduct,
        };
      }),
    );

    const bundles: ProductBundleDto[] = await Promise.all(
      order.Bundles.map(async bundle => {
        const imageUrlBundle = await this.s3Service.getFile(bundle.Image.Url);
        return {
          id: bundle.Id.Id,
          name: bundle.Name.Name,
          price: bundle.Price.Price,
          quantity: bundle.Quantity.Quantity,
          imageUrl: imageUrlBundle,
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
          id: order.Courier.Id.Id,
          name: order.Courier.Name.Name,
          phone: order.Courier.Phone.Phone,
          image: await this.s3Service.getFile(order.Courier.Image.Url),
        }
      : undefined;

    const report: OrderReportDto | null = order.Report
      ? {
          claimDate: order.Report.ClaimDate,
          claim: order.Report.Claim,
        }
      : undefined;

    const direction: DirectionDto = {
      direction: order.Direction.Direction,
      longitude: order.Direction.Longitude,
      latitude: order.Direction.Latitude,
    };

    const response: GetOrderIdServiceResponseDto = {
      id: order.Id.Id,
      state: stateHistory,
      totalAmount: order.TotalAmount.Amount,
      subtotalAmount: order.SubtotalAmount.Amount,
      courier: courier,
      report: report,
      direction: direction,
      products: products,
      bundles: bundles,
    };

    return Result.success<GetOrderIdServiceResponseDto>(response, 200);
  }
}
