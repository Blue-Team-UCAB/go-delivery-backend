import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ormDatabaseProviders } from './common/infrastructure/providers/config/dbConfig';
import { ProductController } from './product/infrastructure/controllers/product.controller';
import { s3Provider } from './common/infrastructure/providers/config/amazonS3Provider';
import { S3Service } from './common/infrastructure/providers/services/s3.service';
import { AppController } from './app.controller';
import { RabbitmqModule } from './common/infrastructure/events/rabbitmq/rabbitmq.module';
import { MessagingService } from './common/application/events/messaging.service';
import { FireBaseConfig } from './common/infrastructure/providers/config/fireBaseConfig';
import { JwtModule } from '@nestjs/jwt';
import { Sha256Service } from './common/infrastructure/providers/services/sha256Service.service';
import { AuthController } from './auth/infrastructure/controller/auth.controller';
import { JwtProvider } from './auth/infrastructure/provider/jwtProvider';
import { JwtGenerator } from './auth/infrastructure/jwt/jwt-generator';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RabbitmqModule,
  ],
  controllers: [ProductController, AppController, AuthController],
  providers: [
    ...ormDatabaseProviders,
    ...s3Provider,
    S3Service,
    ...FireBaseConfig,
    Sha256Service,
    ...JwtProvider,
    {
      provide: 'MessagingService',
      useClass: MessagingService,
    },
  ],
})
export class AppModule {}
