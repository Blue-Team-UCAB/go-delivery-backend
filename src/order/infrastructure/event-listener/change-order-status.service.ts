import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { IListener } from 'src/common/infrastructure/Event-listener/event-listener.interface';

@Controller()
export class OrderStatusChangeCosumerService<T> implements IListener<T> {
  @EventPattern('OrderStatusChangeEvent')
  async handle(@Payload() data: T, @Ctx() context: RmqContext) {
    console.log('OrderStatusChangeEvent', data);
  }
}
