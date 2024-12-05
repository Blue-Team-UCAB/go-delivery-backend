import { IOrderRepository } from '../../domain/repositories/order-repository.interface';
import { IApplicationService } from '../../../common/application/application-services/application-service.interface';
import { CreateOrderServiceEntryDto } from '../dto/entry/create-order-service.entry.dto';
import { IdGenerator } from '../../../common/application/id-generator/id-generator.interface';
import { Result } from '../../../common/domain/result-handler/result';
import { CreateOrderServiceResponseDto, ProductBundleDto } from '../dto/response/create-order-service.response.dto';
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
import { CustomerId } from '../../../customer/domain/value-objects/customer-id';
import { Order } from '../../domain/order';
import { OrderTotalAmount } from '../../domain/value-objects/order-total-amount';
import { OrderSubtotalAmount } from '../../domain/value-objects/order-subtotal-amount';
import { ICustomerRepository } from '../../../customer/domain/repositories/customer-repository.interface';
import { WalletAmount } from '../../../customer/domain/value-objects/wallet-amount';
import { IWalletRepository } from '../../../customer/domain/repositories/wallet-repository.interface';
import { StripeService } from '../../../common/infrastructure/providers/services/stripe.service';
import { IStorageS3Service } from '../../../common/application/s3-storage-service/s3.storage.service.interface';
import { IDateService } from '../../../common/application/date-service/date-service.interface';
import { ICouponRepository } from '../../../coupon/domain/repositories/coupon-repository.interface';
import { Coupon } from '../../../coupon/domain/coupon';
import { CouponId } from '../../../coupon/domain/value-objects/coupon.id';

export class CreateOrderApplicationService implements IApplicationService<CreateOrderServiceEntryDto, CreateOrderServiceResponseDto> {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly productRepository: IProductRepository,
    private readonly bundleRepository: IBundleRepository,
    private readonly customerRepository: ICustomerRepository,
    private readonly walletRepository: IWalletRepository,
    private readonly couponRepository: ICouponRepository,
    private readonly stripeService: StripeService,
    private readonly idGenerator: IdGenerator<string>,
    private readonly s3Service: IStorageS3Service,
    private readonly dateService: IDateService,
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
    for (const bundleDto of data.bundles ?? []) {
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
    let totalAmount = subtotalAmount;
    let coupon: Coupon | null = null;

    if (data.id_coupon) {
      const couponResult = await this.couponRepository.findCouponById(data.id_coupon);
      if (!couponResult.isSuccess) {
        return Result.fail<CreateOrderServiceResponseDto>(couponResult.Error, couponResult.StatusCode, couponResult.Message);
      }
      coupon = couponResult.Value;
      totalAmount = subtotalAmount - (subtotalAmount * coupon.Porcentage.Porcentage) / 100;
    }

    const dataOrder = {
      customerId: CustomerId.create(data.id_customer),
      stateHistory: [OrderState.create(OrderStates.CREATED, new Date())],
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
      dataOrder.stateHistory,
      dataOrder.createdDate,
      dataOrder.totalAmount,
      dataOrder.subtotalAmount,
      dataOrder.direction,
      dataOrder.products,
      dataOrder.bundles,
      null,
      null,
      coupon ? CouponId.create(coupon.Id.Id) : null,
    );

    const regex = new RegExp('^pm_[a-zA-Z0-9]{24}$');
    if (data.token_stripe && regex.test(data.token_stripe)) {
      const paymentSuccess = await this.stripeService.PaymentIntent(totalAmount, data.token_stripe, data.id_stripe_customer);
      if (!paymentSuccess) {
        return Result.fail<CreateOrderServiceResponseDto>(new Error('Payment failed'), 400, 'Payment failed');
      }
    } else {
      const customerResult = await this.customerRepository.findById(data.id_customer);
      if (!customerResult.isSuccess) {
        return Result.fail<CreateOrderServiceResponseDto>(customerResult.Error, customerResult.StatusCode, customerResult.Message);
      }
      const customer = customerResult.Value;
      if (customer.Wallet.Amount.Amount < totalAmount) {
        return Result.fail<CreateOrderServiceResponseDto>(null, 400, 'Insufficient funds in wallet');
      }
      customer.subtractWallet(WalletAmount.create(totalAmount));
      const updatedWallet = await this.walletRepository.saveWallet(customer.Wallet);

      if (!updatedWallet.isSuccess) {
        return Result.fail<CreateOrderServiceResponseDto>(updatedWallet.Error, updatedWallet.StatusCode, updatedWallet.Message);
      }
    }

    const result = await this.orderRepository.saveOrderAggregate(order);

    if (!result.isSuccess()) {
      return Result.fail<CreateOrderServiceResponseDto>(result.Error, result.StatusCode, result.Message);
    }

    const products: ProductBundleDto[] = await Promise.all(
      order.Products.map(async product => {
        let imageUrlProduct = await this.s3Service.getFile(product.Image.Url);
        return {
          id: product.Id.Id,
          name: product.Name.Name,
          price: product.Price.Price,
          imageUrl: imageUrlProduct,
          quantity: product.Quantity.Quantity,
        };
      }),
    );

    const bundles: ProductBundleDto[] = await Promise.all(
      order.Bundles.map(async bundle => {
        let imageUrlBundle = await this.s3Service.getFile(bundle.Image.Url);
        return {
          id: bundle.Id.Id,
          name: bundle.Name.Name,
          price: bundle.Price.Price,
          imageUrl: imageUrlBundle,
          quantity: bundle.Quantity.Quantity,
        };
      }),
    );

    const stateHistory = await Promise.all(
      order.StateHistory.map(async state => ({
        state: state.State,
        date: await this.dateService.toUtcMinus4(state.Date),
      })),
    );

    const response: CreateOrderServiceResponseDto = {
      id: order.Id.Id,
      state: stateHistory,
      totalAmount: order.TotalAmount.Amount,
      subtotalAmount: order.SubtotalAmount.Amount,
      direction: {
        direction: order.Direction.Direction,
        longitude: order.Direction.Longitude,
        latitude: order.Direction.Latitude,
      },
      products: products,
      bundles: bundles,
    };

    return Result.success<CreateOrderServiceResponseDto>(response, 200);
  }
}
