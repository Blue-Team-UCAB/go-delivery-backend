import { IOrderRepository } from '../../domain/repositories/order-repository.interface';
import { IApplicationService } from '../../../common/application/application-services/application-service.interface';
import { CreateOrderServiceEntryDto } from '../dto/entry/create-order-service-entry.dto';
import { IdGenerator } from '../../../common/application/id-generator/id-generator.interface';
import { Result } from '../../../common/domain/result-handler/result';
import { CreateOrderServiceResponseDto } from '../dto/response/create-order-service-response.dto';
import { OrderDirection } from '../../domain/value-objects/order-direction';
import { OrderId } from '../../domain/value-objects/order.id';
import { OrderState, OrderStates } from '../../domain/value-objects/order-state';
import { OrderCreatedDate } from '../../domain/value-objects/order-created-date';
import { OrderProduct } from '../../domain/entities/order-product';
import { IProductRepository } from '../../../product/domain/repositories/product-repository.interface';
import { IBundleRepository } from '../../../bundle/domain/repositories/bundle-repository.interface';
import { ProductId } from '../../../product/domain/value-objects/product.id';
import { OrderProductName } from '../../domain/value-objects/order-product-name';
import { OrderProductPrice } from '../../domain/value-objects/order-product-price';
import { OrderProductImage } from '../../domain/value-objects/order-product-image';
import { OrderProductQuantity } from '../../domain/value-objects/order-product-quantity';
import { OrderBundle } from '../../domain/entities/order-bundle';
import { BundleId } from '../../../bundle/domain/value-objects/bundle.id';
import { OrderBundleName } from '../../domain/value-objects/order-bundle-name';
import { OrderBundlePrice } from '../../domain/value-objects/order-bundle-price';
import { OrderBundleImage } from '../../domain/value-objects/order-bundle-image';
import { OrderBundleQuantity } from '../../domain/value-objects/order-bundle-quantity';
import { CustomerId } from 'src/customer/domain/value-objects/customer-id';
import { Order } from 'src/order/domain/order';
import { OrderTotalAmount } from 'src/order/domain/value-objects/order-total-amount';
import { OrderSubtotalAmount } from 'src/order/domain/value-objects/order-subtotal-amount';

export class CreateOrderApplicationService implements IApplicationService<CreateOrderServiceEntryDto, CreateOrderServiceResponseDto> {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly productRepository: IProductRepository,
    private readonly bundleRepository: IBundleRepository,
    private readonly idGenerator: IdGenerator<string>,
  ) {}

  async execute(data: CreateOrderServiceEntryDto): Promise<Result<CreateOrderServiceResponseDto>> {
    const orderProducts: OrderProduct[] = [];
    for (const productDto of data.products) {
      const productResult = await this.productRepository.findProductById(productDto.id);
      if (!productResult.isSuccess) {
        return Result.fail<CreateOrderServiceResponseDto>(productResult.Error, productResult.StatusCode, productResult.Message);
      }
      const product = productResult.Value;
      orderProducts.push(
        new OrderProduct(
          ProductId.create(product.Id.Id),
          OrderProductName.create(product.Name.Name),
          OrderProductPrice.create(product.Price.Price),
          OrderProductImage.create(product.ImageUrl.Url),
          OrderProductQuantity.create(productDto.quantity),
        ),
      );
    }

    const orderBundles: OrderBundle[] = [];
    for (const bundleDto of data.bundles) {
      const bundleResult = await this.bundleRepository.findBundleById(bundleDto.id);
      if (!bundleResult.isSuccess) {
        return Result.fail<CreateOrderServiceResponseDto>(bundleResult.Error, bundleResult.StatusCode, bundleResult.Message);
      }
      const bundle = bundleResult.Value;
      orderBundles.push(
        new OrderBundle(
          BundleId.create(bundle.Id.Id),
          OrderBundleName.create(bundle.Name.Name),
          OrderBundlePrice.create(bundle.Price.Price),
          OrderBundleImage.create(bundle.ImageUrl.Url),
          OrderBundleQuantity.create(bundleDto.quantity),
        ),
      );
    }

    const subtotalAmount =
      orderProducts.reduce((sum, product) => sum + product.Price.Price * product.Quantity.Quantity, 0) + orderBundles.reduce((sum, bundle) => sum + bundle.Price.Price * bundle.Quantity.Quantity, 0);
    const totalAmount = subtotalAmount; //todo Aqui hay que agregar los cupones o descuentos

    const dataOrder = {
      customerId: CustomerId.create(data.token),
      state: OrderState.create(OrderStates.CREATED),
      createdDate: OrderCreatedDate.create(new Date()),
      direction: OrderDirection.create(data.direction, data.longitude, data.latitude),
      totalAmount: OrderTotalAmount.create(totalAmount),
      subtotalAmount: OrderSubtotalAmount.create(subtotalAmount),
      products: orderProducts,
      bundles: orderBundles,
    };

    const order = new Order(
      OrderId.create(await this.idGenerator.generateId()),
      dataOrder.customerId,
      dataOrder.state,
      dataOrder.createdDate,
      dataOrder.totalAmount,
      dataOrder.subtotalAmount,
      dataOrder.direction,
      dataOrder.products,
      dataOrder.bundles,
      null,
      null,
      null,
    );

    const result = await this.orderRepository.saveOrderAggregate(order);

    if (!result.isSuccess()) {
      return Result.fail<CreateOrderServiceResponseDto>(result.Error, result.StatusCode, result.Message);
    }

    const response: CreateOrderServiceResponseDto = {
      id: order.Id.Id,
      state: order.State.State,
      createdDate: order.CreatedDate.CreatedDate,
      totalAmount: order.TotalAmount.Amount,
      subtotalAmount: order.SubtotalAmount.Amount,
      direction: {
        direction: order.Direction.Direction,
        longitude: order.Direction.Longitude,
        latitude: order.Direction.Latitude,
      },
      products: order.Products.map(product => ({
        id: product.Id.Id,
        name: product.Name.Name,
        price: product.Price.Price,
        imageUrl: product.Image.Url,
        quantity: product.Quantity.Quantity,
      })),
      bundles: order.Bundles.map(bundle => ({
        id: bundle.Id.Id,
        name: bundle.Name.Name,
        price: bundle.Price.Price,
        imageUrl: bundle.Image.Url,
        quantity: bundle.Quantity.Quantity,
      })),
    };

    return Result.success<CreateOrderServiceResponseDto>(response, 200);
  }
}
