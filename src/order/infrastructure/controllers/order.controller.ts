import { Body, Controller, Inject, Post, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BundleRepository } from '../../../bundle/infrastructure/repository/bundle.repository';
import { UuidGenerator } from '../../../common/infrastructure/id-generator/uuid-generator';
import { ProductRepository } from '../../../product/infrastructure/repository/product.repository';
import { DataSource } from 'typeorm';
import { IsAdmin } from '../../../auth/infrastructure/jwt/decorator/isAdmin.decorator';
import { CreateOrderApplicationService } from 'src/order/application/commands/create-order-application.service';
import { CreateOrderDto } from '../dto/create-order-dto';
import { OrderRepository } from '../repository/order.repository';

@ApiTags('Orders')
@Controller('order')
export class OrderController {
  private readonly orderRepository: OrderRepository;
  private readonly productRepository: ProductRepository;
  private readonly bundleRepository: BundleRepository;
  private readonly uuidCreator: UuidGenerator;

  constructor(
    @Inject('BaseDeDatos')
    private readonly dataSource: DataSource,
  ) {
    this.uuidCreator = new UuidGenerator();
    this.productRepository = new ProductRepository(this.dataSource);
    this.bundleRepository = new BundleRepository(this.dataSource);
    this.orderRepository = new OrderRepository(this.dataSource);
  }

  @Post()
  @IsAdmin()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const service = new CreateOrderApplicationService(this.orderRepository, this.productRepository, this.bundleRepository, this.uuidCreator);
    return (await service.execute(createOrderDto)).Value;
  }
}
