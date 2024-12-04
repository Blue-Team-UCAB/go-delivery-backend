import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { IListener } from 'src/common/infrastructure/Event-listener/event-listener.interface';
import { FirebaseNotifierService } from 'src/common/infrastructure/providers/services/push.notification.service';
import { PushNotificationDto } from 'src/common/infrastructure/Push-Notification/push-notification-dto';

@Controller()
export class OrderStatusChangeCosumerService<T> implements IListener<T> {
  constructor(private readonly firebaseNotifierService: FirebaseNotifierService) {}

  @EventPattern('OrderStatusChangeEvent')
  async handle(@Payload() data: T, @Ctx() context: RmqContext) {
    const msg: PushNotificationDto = {
      token: 'd7l9FSxOS5-fUKnZbCc2G2:APA91bHYpRlATG56LbSPGNeGBI8NV-zLzVq9DVhFDAW81_vY77JOQrxeUuFRUGqCqklnBW6dNpeoIpHmLQXVFQtS8BX8tvdF3sBQFNE5gkO5nt6nElXjK5A',
      title: 'ENVIADO DESDE EL BACKEND',
      body: 'Your order status has been changed to ' + 'IN_PROCRESS',
    };
    this.firebaseNotifierService.sendNotification(msg);
  }
}
