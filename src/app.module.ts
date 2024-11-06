import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ormDatabaseProviders } from 'src/common/infrastructure/providers/config/dbConfig';
import { ProductController } from './product/infrastructure/controllers/product.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ProductController],
  providers: [...ormDatabaseProviders],
})
export class AppModule {}
