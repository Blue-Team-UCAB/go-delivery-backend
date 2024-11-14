import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DomainEvent } from './model/event.schema';
import { Model } from 'mongoose';
import { DomainEventBase } from '../../../common/domain/domain-event';

@Injectable()
export class EventStorageMongoService {
  constructor(@InjectModel(DomainEvent.name) private domainModel: Model<DomainEvent>) {}

  async save(event: DomainEventBase): Promise<void> {
    const { name, timestamp, ...rest } = event;
    await this.domainModel.create({
      name,
      timestamp,
      data: rest,
    });
  }
}
