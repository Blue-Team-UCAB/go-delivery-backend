import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ormDatabaseProviders } from './common/infrastructure/providers/config/dbConfig';
import { ProductController } from './product/infrastructure/controllers/product.controller';
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

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ProductController, AppController, AuthController, CreateProductConsumerService],
  providers: [...ormDatabaseProviders, ...s3Provider, S3Service, ...FireBaseConfig, Sha256Service, ...JwtProvider, ...RabbitMQProvider, EventPublisher, MailSenderService, UserEmailProvider],
})
export class AppModule {}
