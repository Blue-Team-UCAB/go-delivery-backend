import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { IListener } from 'src/common/infrastructure/Event-listener/event-listener.interface';
import { FirebaseNotifierService } from 'src/common/infrastructure/providers/services/push.notification.service';
import { PushNotificationDto } from 'src/common/infrastructure/Push-Notification/push-notification-dto';

@Controller()
export class OrderStatusChangeCosumerService<T extends DataDto> implements IListener<T> {
  constructor(private readonly firebaseNotifierService: FirebaseNotifierService) {}

  @EventPattern('OrderStatusChangeEvent')
  async handle(@Payload() data: T, @Ctx() context: RmqContext) {
    data.data.linkedDivices.forEach(token => {
      const msg: PushNotificationDto = {
        token: token,
        title: `Orden ${data.data.idOrder._id.slice(-5)} actualizada`,
        body: `El estatus de tu orden ha cambiado a: ${data.data.state._state.toLowerCase()}`,
      };
      this.firebaseNotifierService.sendNotification(msg);
    });
  }
}

export interface DataDto {
  name: string;
  timestamp: string;
  data: {
    idOrder: {
      _id: string;
    };
    state: { _state: string; _date: string };
    linkedDivices: string[];
  };
}
