import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IPublisher } from '../../application/events/eventPublisher.interface';
import { Observable } from 'rxjs';

@Injectable()
export class EventPublisher<T> implements IPublisher<T> {
  constructor(
    @Inject('RabbitMQProxy')
    private readonly client: ClientProxy,
  ) {}

  async publish(pattern: string, data: T): Promise<Observable<T>> {
    return this.client.emit(pattern, data);
  }
}
