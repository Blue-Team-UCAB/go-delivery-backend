import { Module } from '@nestjs/common';
import { EventStorageMongoService } from './mongo-event.service';
import { DomainEvent, DomainEventSchema } from './model/event.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DomainEvent.name,
        schema: DomainEventSchema,
      },
    ]),
  ],
  controllers: [],
  providers: [EventStorageMongoService],
  exports: [EventStorageMongoService],
})
export class MongoEventModule {}
