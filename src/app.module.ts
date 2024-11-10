import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ormDatabaseProviders } from './common/infrastructure/providers/config/dbConfig';
import { ProductController } from './product/infrastructure/controllers/product.controller';
import { s3Provider } from './common/infrastructure/providers/config/amazonS3Provider';
import { S3Service } from './common/infrastructure/providers/services/s3.service';
import { AppController } from './app.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ProductController, AppController],
  providers: [...ormDatabaseProviders, ...s3Provider, S3Service],
})
export class AppModule {}
