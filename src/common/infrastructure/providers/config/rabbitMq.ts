import { ConfigService } from '@nestjs/config';
import { Transport, MicroserviceOptions, ClientProxyFactory, ClientOptions } from '@nestjs/microservices';

export const RabbitMQProvider = [
  {
    provide: 'RabbitMQConfig',
    useFactory: (): ClientOptions => ({
      transport: Transport.RMQ,
      options: {
        urls: [
          {
            protocol: 'amqp',
            hostname: process.env.RABBITMQ_HOST,
            port: process.env.RABBITMQ_PORT ? parseInt(process.env.RABBITMQ_PORT, 10) : 5672,
            username: process.env.RABBITMQ_USERNAME,
            password: process.env.RABBITMQ_PASSWORD,
            vhost: process.env.RABBITMQ_VHOST || '/',
            frameMax: 8192,
          },
        ],
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
    urls: [
      {
        protocol: 'amqp',
        hostname: process.env.RABBITMQ_HOST,
        port: process.env.RABBITMQ_PORT ? parseInt(process.env.RABBITMQ_PORT, 10) : 5672,
        username: process.env.RABBITMQ_USERNAME,
        password: process.env.RABBITMQ_PASSWORD,
        vhost: process.env.RABBITMQ_VHOST || '/',
        frameMax: 8192,
      },
    ],
    queue: configService.get<string>('RABBITMQ_QUEUE'),
    queueOptions: {
      durable: true,
    },
  },
});
