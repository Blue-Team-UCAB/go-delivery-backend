import { Body, Controller, Inject, Post, UseInterceptors } from '@nestjs/common';
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

@ApiTags('Orders')
@Controller('order')
export class OrderController {
  private readonly orderRepository: OrderRepository;
  private readonly productRepository: ProductRepository;
  private readonly bundleRepository: BundleRepository;
  private readonly customerRepository: CustomerRepository;
  private readonly walletRepository: WalletRepository;
  private readonly uuidCreator: UuidGenerator;

  constructor(
    @Inject('BaseDeDatos')
    private readonly dataSource: DataSource,
  ) {
    this.uuidCreator = new UuidGenerator();
    this.productRepository = new ProductRepository(this.dataSource);
    this.bundleRepository = new BundleRepository(this.dataSource);
    this.orderRepository = new OrderRepository(this.dataSource);
    this.customerRepository = new CustomerRepository(this.dataSource);
    this.walletRepository = new WalletRepository(this.dataSource);
  }

  @Post()
  @UseAuth()
  @IsClientOrAdmin()
  async createOrder(@Body() createOrderDto: CreateOrderDto, @GetUser() user: any) {
    const service = new CreateOrderApplicationService(this.orderRepository, this.productRepository, this.bundleRepository, this.customerRepository, this.walletRepository, this.uuidCreator);
    createOrderDto.token = user.idCostumer;
    return (await service.execute(createOrderDto)).Value;
  }
}
