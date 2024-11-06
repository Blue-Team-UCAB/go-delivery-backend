import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ormDatabaseProviders } from 'src/common/infrastructure/providers/config/dbConfig';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [],
  providers: [...ormDatabaseProviders],
})
export class AppModule {}
