import { Body, Controller, Inject, Post, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BundleRepository } from '../../../bundle/infrastructure/repository/bundle.repository';
import { UuidGenerator } from '../../../common/infrastructure/id-generator/uuid-generator';
import { ProductRepository } from '../../../product/infrastructure/repository/product.repository';
import { DataSource } from 'typeorm';
import { CreateOrderApplicationService } from 'src/order/application/commands/create-order-application.service';
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
import { IsAdmin } from 'src/auth/infrastructure/jwt/decorator/isAdmin.decorator';
import { ChangeOrderStatusApplicationService } from 'src/order/application/commands/chage-order-status.application.service';
import { ChangeOrderStatusDto } from '../dto/change-order-status.dto';
import { EventPublisher } from 'src/common/infrastructure/Event-Publisher/eventPublisher.service';
import { DomainEventBase } from 'src/common/domain/domain-event';

@ApiTags('Orders')
@Controller('order')
export class OrderController {
  private readonly orderRepository: OrderRepository;
  private readonly productRepository: ProductRepository;
  private readonly bundleRepository: BundleRepository;
  private readonly customerRepository: CustomerRepository;
  private readonly walletRepository: WalletRepository;
  private readonly stripeService: StripeService;
  private readonly uuidCreator: UuidGenerator;
  private;

  constructor(
    @Inject('BaseDeDatos')
    private readonly dataSource: DataSource,
    private readonly s3Service: S3Service,
    private readonly publisher: EventPublisher<DomainEventBase>,
  ) {
    this.uuidCreator = new UuidGenerator();
    this.productRepository = new ProductRepository(this.dataSource);
    this.bundleRepository = new BundleRepository(this.dataSource);
    this.orderRepository = new OrderRepository(this.dataSource);
    this.customerRepository = new CustomerRepository(this.dataSource);
    this.walletRepository = new WalletRepository(this.dataSource);
    this.stripeService = new StripeService();
  }

  @Post()
  @UseAuth()
  @IsClientOrAdmin()
  async createOrder(@Body() createOrderDto: CreateOrderDto, @GetUser() user: any) {
    const service = new CreateOrderApplicationService(
      this.orderRepository,
      this.productRepository,
      this.bundleRepository,
      this.customerRepository,
      this.walletRepository,
      this.stripeService,
      this.uuidCreator,
      this.s3Service,
    );
    return (await service.execute({ ...createOrderDto, id_customer: user.idCostumer, id_stripe_customer: user.idStripe })).Value;
  }

  @Get(':id')
  @IsClientOrAdmin()
  async getOrderId(@Param('id') id: string) {
    const service = new GetOrderByIdApplicationService(this.orderRepository, this.s3Service);
    return (await service.execute({ id: id })).Value;
  }

  @Post('change-status')
  @IsAdmin()
  @UseAuth()
  async changeOrderStatus(@Body() data: ChangeOrderStatusDto, @GetUser() user: any) {
    const service = new ChangeOrderStatusApplicationService(this.orderRepository, this.publisher);
    return await service.execute({ ...data, linkedDivices: user.linkedDivices });
  }
}
