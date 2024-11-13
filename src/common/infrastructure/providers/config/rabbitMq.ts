import { ConfigService } from '@nestjs/config';
import { Transport, MicroserviceOptions, ClientProxyFactory, ClientOptions } from '@nestjs/microservices';

export const RabbitMQProvider = [
  {
    provide: 'RabbitMQConfig',
    useFactory: (): ClientOptions => ({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: process.env.RABBITMQ_QUEUE,
        queueOptions: {
          durable: true,
        },
      },
    }),
  },
  {
    provide: 'RabbitMQProxy',
    useFactory: (rabbitMQConfig: ClientOptions) => ClientProxyFactory.create(rabbitMQConfig),
    inject: ['RabbitMQConfig'],
  },
];

export const RabbitMQMicroservice = (configService: ConfigService): MicroserviceOptions => ({
  transport: Transport.RMQ,
  options: {
    urls: [configService.get<string>('RABBITMQ_URL')],
    queue: configService.get<string>('RABBITMQ_QUEUE'),
    queueOptions: {
      durable: true,
    },
  },
});
