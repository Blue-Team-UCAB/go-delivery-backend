import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { IListener } from '../../../common/infrastructure/Event-listener/event-listener.interface';

@Controller()
export class CreateProductConsumerService<T> implements IListener<T> {
  @EventPattern('ProductCreatedEvent')
  async handle(@Payload() data: T, @Ctx() context: RmqContext) {
    console.log('Product created event received:', data);
  }
}
