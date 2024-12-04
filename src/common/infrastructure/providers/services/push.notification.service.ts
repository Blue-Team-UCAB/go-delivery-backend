import { Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { PushNotificationDto } from '../../Push-Notification/push-notification-dto';

export class FirebaseNotifierService {
  constructor(
    @Inject('FireBaseConfig')
    private readonly firebaseApp: admin.app.App,
  ) {}

  async sendNotification(message: PushNotificationDto): Promise<void> {
    const msg = {
      token: message.token,
      android: {
        notification: {
          imageUrl: 'https://godely.s3.us-east-1.amazonaws.com/logoGodely.jpg',
          title: message.title,
          body: message.body,
        },
      },
    };

    try {
      const res = await this.firebaseApp.messaging().send(msg);
    } catch (error) {
      throw new Error(error);
    }
  }
}
