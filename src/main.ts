import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { RabbitMQMicroservice } from './common/infrastructure/providers/config/rabbitMq';

async function GoDely() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Range',
  });

  app.connectMicroservice<MicroserviceOptions>(RabbitMQMicroservice(app.get(ConfigService)));
  await app.startAllMicroservices();

  const config = new DocumentBuilder().setTitle('Go Dely API').setDescription('Delivery app backend done with DDD.').setVersion('1.0').addBearerAuth().build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/documentation', app, documentFactory);

  await app.listen(process.env.PORT, '0.0.0.0');
}

GoDely();
