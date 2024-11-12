import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ormDatabaseProviders } from './common/infrastructure/providers/config/dbConfig';
import { ProductController } from './product/infrastructure/controllers/product.controller';
import { s3Provider } from './common/infrastructure/providers/config/amazonS3Provider';
import { S3Service } from './common/infrastructure/providers/services/s3.service';
import { AppController } from './app.controller';
import { RabbitmqModule } from './common/infrastructure/events/rabbitmq/rabbitmq.module';
import { MessagingService } from './common/application/events/messaging.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RabbitmqModule,
  ],
  controllers: [ProductController, AppController],
  providers: [
    ...ormDatabaseProviders,
    ...s3Provider,
    S3Service,
    {
      provide: 'MessagingService',
      useClass: MessagingService,
    },
  ],
})
export class AppModule {}
