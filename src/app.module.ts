import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ormDatabaseProviders } from './common/infrastructure/providers/config/dbConfig';
import { ProductController } from './product/infrastructure/controllers/product.controller';
import { BundleController } from './bundle/infrastructure/controllers/bundle.controller';
import { s3Provider } from './common/infrastructure/providers/config/amazonS3Provider';
import { S3Service } from './common/infrastructure/providers/services/s3.service';
import { AppController } from './app.controller';
import { FireBaseConfig } from './common/infrastructure/providers/config/fireBaseConfig';
import { Sha256Service } from './common/infrastructure/providers/services/sha256Service.service';
import { AuthController } from './auth/infrastructure/controller/auth.controller';
import { JwtProvider } from './auth/infrastructure/provider/jwtProvider';
import { RabbitMQProvider } from './common/infrastructure/providers/config/rabbitMq';
import { CreateProductConsumerService } from './product/infrastructure/event-listener/create-product-consumer.service';
import { EventPublisher } from './common/infrastructure/Event-Publisher/eventPublisher.service';
import { MailSenderService } from './common/infrastructure/providers/services/emailProvider.service';
import { UserEmailProvider } from './auth/infrastructure/provider/userEmail.provider';
import { MongoEventModule } from './common/infrastructure/mongo-event/mongo-event.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DateService } from './common/infrastructure/providers/services/date.service';
import { UuidGenerator } from './common/infrastructure/id-generator/uuid-generator';
import { CodeVerificationService } from './common/infrastructure/providers/services/codeGenerator.service';
import { CategoryController } from './category/infrastructure/controllers/category.controller';
import { PaymentController } from './payment/infrastructure/controllers/payment.controller';
import { HttpModule } from '@nestjs/axios';
import { ApiBCV } from './common/infrastructure/providers/services/payment-banco-central.api.service';
import { PaymentCheckPagoMovil } from './common/infrastructure/payment-check/payment-check-pagoMovil';
import { OrderController } from './order/infrastructure/controllers/order.controller';
import { OrderStatusChangeCosumerService } from './order/infrastructure/event-listener/change-order-status.service';
import { CouponController } from './coupon/infrastructure/controllers/coupon.controller';
import { FirebaseNotifierService } from './common/infrastructure/providers/services/push.notification.service';
import { DiscountController } from './discount/infrastructure/controllers/discount.controller';
import { UserController } from './customer/infrastructure/controller/costumer.controller';
import { NotificationsController } from './auth/infrastructure/controller/notification.controller';
import { BestForTheCustomerStrategy } from './common/infrastructure/select-discount-strategies/best-for-the-customer-strategy';
import { IAController } from './IA/infrastructure/controllers/ia.controller';
import { OrderVectorModifyService } from './order/infrastructure/event-listener/order-create-handle-vector.service';

@Module({
  imports: [ConfigModule.forRoot(), MongooseModule.forRoot(`${process.env.MONGO_DB_URL}`), MongoEventModule, HttpModule],
  controllers: [
    CouponController,
    OrderController,
    ProductController,
    BundleController,
    CategoryController,
    AppController,
    AuthController,
    CreateProductConsumerService,
    PaymentController,
    OrderStatusChangeCosumerService,
    DiscountController,
    UserController,
    NotificationsController,
    IAController,
    OrderVectorModifyService,
  ],
  providers: [
    ...ormDatabaseProviders,
    ...s3Provider,
    S3Service,
    ...FireBaseConfig,
    Sha256Service,
    ...JwtProvider,
    ...RabbitMQProvider,
    EventPublisher,
    MailSenderService,
    UserEmailProvider,
    BestForTheCustomerStrategy,
    DateService,
    UuidGenerator,
    CodeVerificationService,
    ApiBCV,
    PaymentCheckPagoMovil,
    FirebaseNotifierService,
  ],
})
export class AppModule {}
