import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ormDatabaseProviders } from 'src/common/infrastructure/providers/config/dbConfig';
import { ProductController } from './product/infrastructure/controllers/product.controller';
import { s3Provider } from './common/infrastructure/providers/config/amazonS3Provider';
import { S3Service } from './common/infrastructure/providers/services/s3.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ProductController],
  providers: [...ormDatabaseProviders, ...s3Provider, S3Service],
})
export class AppModule {}
