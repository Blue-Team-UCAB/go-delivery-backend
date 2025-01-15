import { Body, Controller, Inject, Post, Get, Param, Query, ValidationPipe, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { BundleRepository } from '../../../bundle/infrastructure/repository/bundle.repository';
import { UuidGenerator } from '../../../common/infrastructure/id-generator/uuid-generator';
import { ProductRepository } from '../../../product/infrastructure/repository/product.repository';
import { DataSource } from 'typeorm';
import { CreateOrderApplicationService } from '../../application/commands/create-order-application.service';
import { CreateOrderDto } from '../dto/create-order-dto';
import { OrderRepository } from '../repository/order.repository';
import { IsClientOrAdmin } from '../../../auth/infrastructure/jwt/decorator/isClientOrAdmin.decorator';
import { UseAuth } from '../../../auth/infrastructure/jwt/decorator/useAuth.decorator';
import { GetUser } from '../../../auth/infrastructure/jwt/decorator/get-user.decorator';
import { CustomerRepository } from '../../../customer/infrastructure/repository/costumer-repository';
import { WalletRepository } from '../../../customer/infrastructure/repository/wallet-repository';
import { StripeService } from '../../../common/infrastructure/providers/services/stripe.service';
import { S3Service } from '../../../common/infrastructure/providers/services/s3.service';
import { GetOrderByIdApplicationService } from '../../application/queries/get-order-id.application.service';
import { GetOrderPageDto } from '../dto/get-order-page.dto';
import { GetOrderByPageApplicationService } from '../../application/queries/get-order-page.application.service';
import { IsAdmin } from '../../../auth/infrastructure/jwt/decorator/isAdmin.decorator';
import { ChangeOrderStatusApplicationService } from '../../application/commands/chage-order-status.application.service';
import { ChangeOrderStatusDto } from '../dto/change-order-status.dto';
import { EventPublisher } from '../../../common/infrastructure/Event-Publisher/eventPublisher.service';
import { DomainEventBase } from '../../../common/domain/domain-event';
import { DateService } from '../../../common/infrastructure/providers/services/date.service';
import { CourierRepository } from '../repository/courier.repository';
import { CouponRepository } from '../../../coupon/infrastructure/repository/coupon.repository';
import { AuthInterface } from '../../../common/infrastructure/auth-interface/aunt.interface';
import { CancelOrderDto } from '../dto/cancel-oder.dto';
import { CancelOrderApplicationService } from '../../application/commands/cancel-oder.application.service';
import { IUserRepository } from '../../../auth/application/repository/user-repository.interface';
import { UserRepository } from '../../../auth/infrastructure/repository/user.repository';
import { ReportOrder } from '../dto/report-order.dto';
import { ReportOrderApplicationService } from '../../application/commands/report-order.application.service';
import { PaymentRepository } from '../../../payment/infrastructure/repository/payment-repository';
import { ErrorHandlerAspect } from '../../../common/application/aspects/error-handler-aspect';
import { DirectionRepository } from '../../../customer/infrastructure/repository/direction-repository';
import { DiscountRepository } from '../../../discount/infrastructure/repository/discount.repository';
import { BestForTheCustomerStrategy } from '../../../common/infrastructure/select-discount-strategies/best-for-the-customer-strategy';
import { OrderStates } from 'src/order/domain/value-objects/order-state';
import { CourierMovement } from '../helper/courier-movement';
import { MovementRepository } from '../repository/movement.repository';

@ApiTags('Orders')
@Controller('order')
export class OrderController {
  private readonly orderRepository: OrderRepository;
  private readonly productRepository: ProductRepository;
  private readonly bundleRepository: BundleRepository;
  private readonly customerRepository: CustomerRepository;
  private readonly directionRepositoy: DirectionRepository;
  private readonly walletRepository: WalletRepository;
  private readonly stripeService: StripeService;
  private readonly uuidCreator: UuidGenerator;
  private readonly courierRepository: CourierRepository;
  private readonly couponRepository: CouponRepository;
  private readonly userRepository: IUserRepository;
  private readonly paymentRepository: PaymentRepository;
  private readonly discountRepository: DiscountRepository;
  private readonly movementRepository: MovementRepository;

  constructor(
    @Inject('BaseDeDatos')
    private readonly dataSource: DataSource,
    private readonly s3Service: S3Service,
    private readonly dateService: DateService,
    private readonly publisher: EventPublisher<DomainEventBase>,
    private readonly bestForTheCustomerStrategy: BestForTheCustomerStrategy,
  ) {
    this.uuidCreator = new UuidGenerator();
    this.productRepository = new ProductRepository(this.dataSource);
    this.bundleRepository = new BundleRepository(this.dataSource);
    this.orderRepository = new OrderRepository(this.dataSource);
    this.customerRepository = new CustomerRepository(this.dataSource);
    this.walletRepository = new WalletRepository(this.dataSource);
    this.stripeService = new StripeService();
    this.courierRepository = new CourierRepository(this.dataSource);
    this.couponRepository = new CouponRepository(this.dataSource);
    this.userRepository = new UserRepository(this.dataSource);
    this.paymentRepository = new PaymentRepository(this.dataSource);
    this.directionRepositoy = new DirectionRepository(this.dataSource);
    this.discountRepository = new DiscountRepository(this.dataSource);
    this.movementRepository = new MovementRepository(this.dataSource);
  }

  @Post('pay/stripe')
  @UseAuth()
  @IsClientOrAdmin()
  @ApiBearerAuth()
  async createOrder(@Body() createOrderDto: CreateOrderDto, @GetUser() user: AuthInterface) {
    const service = new ErrorHandlerAspect(
      new CreateOrderApplicationService(
        this.orderRepository,
        this.productRepository,
        this.bundleRepository,
        this.customerRepository,
        this.directionRepositoy,
        this.walletRepository,
        this.couponRepository,
        this.stripeService,
        this.uuidCreator,
        this.s3Service,
        this.dateService,
        this.bestForTheCustomerStrategy,
        this.discountRepository,
      ),
      (error: Error) => {
        throw new InternalServerErrorException('Error creating order');
      },
    );
    return (await service.execute({ ...createOrderDto, id_customer: user.idCostumer, id_stripe_customer: user.idStripe })).Value;
  }

  @Get(':id')
  @IsClientOrAdmin()
  @ApiBearerAuth()
  async getOrderId(@Param('id') id: string) {
    const service = new ErrorHandlerAspect(new GetOrderByIdApplicationService(this.orderRepository, this.s3Service, this.dateService), (error: Error) => {
      throw new NotFoundException('Order not found');
    });
    return (await service.execute({ id })).Value;
  }

  @Get('user/many')
  @UseAuth()
  @IsClientOrAdmin()
  @ApiBearerAuth()
  async getOrderPage(@Query(ValidationPipe) query: GetOrderPageDto, @GetUser() user: AuthInterface) {
    const { page, perpage, status } = query;
    const service = new ErrorHandlerAspect(new GetOrderByPageApplicationService(this.orderRepository, this.dateService), (error: Error) => {
      throw new InternalServerErrorException('Error getting orders');
    });
    return (await service.execute({ page, perpage, id_customer: user.idCostumer, status })).Value;
  }

  @Post('change-status')
  @IsAdmin()
  @ApiBearerAuth()
  async changeOrderStatus(@Body() data: ChangeOrderStatusDto) {
    const service = new ErrorHandlerAspect(new ChangeOrderStatusApplicationService(this.orderRepository, this.publisher, this.courierRepository, this.userRepository), (error: Error) => {
      throw new InternalServerErrorException('Error changing order status');
    });
    return (await service.execute(data)).Value;
  }

  @Post('cancel')
  @UseAuth()
  @IsClientOrAdmin()
  @ApiBearerAuth()
  async cancelOrder(@Body() data: CancelOrderDto, @GetUser() user: AuthInterface) {
    const service = new ErrorHandlerAspect(
      new CancelOrderApplicationService(this.orderRepository, this.stripeService, this.customerRepository, this.walletRepository, this.paymentRepository, this.uuidCreator),
      (error: Error) => {
        throw new InternalServerErrorException('Error cancelling order');
      },
    );
    return (await service.execute({ ...data, idCustomer: user.idCostumer, idStripe: user.idStripe })).Value;
  }

  @Post('report')
  @IsClientOrAdmin()
  @UseAuth()
  @ApiBearerAuth()
  async reportOrder(@Body() data: ReportOrder, @GetUser() user: AuthInterface) {
    const service = new ErrorHandlerAspect(new ReportOrderApplicationService(this.orderRepository), (error: Error) => {
      throw new InternalServerErrorException('Error reporting order');
    });
    return (await service.execute({ ...data })).Value;
  }

  @Get('courier/position/:id')
  @IsClientOrAdmin()
  @ApiBearerAuth()
  async getCourierPosition(@Param('id') id: string) {
    const order = await this.orderRepository.getCourierParams(id);
    if (!order.isSuccess()) {
      throw new NotFoundException('Order not found');
    }

    const cancelledOrDelivered = order.Value.ordenState.some(state => state === OrderStates.CANCELLED || state === OrderStates.DELIVERED);
    if (cancelledOrDelivered) {
      throw new NotFoundException('Order is cancelled or delivered');
    }

    const shipped = order.Value.ordenState.some(state => state === OrderStates.SHIPPED);
    if (!shipped) {
      throw new NotFoundException('Order is not shipped');
    }

    const courierMovement = new CourierMovement(this.movementRepository, new ChangeOrderStatusApplicationService(this.orderRepository, this.publisher, this.courierRepository, this.userRepository));
    return courierMovement.getCourierMovement(order.Value.latitude.toString(), order.Value.longitude.toString(), id);
  }
}
