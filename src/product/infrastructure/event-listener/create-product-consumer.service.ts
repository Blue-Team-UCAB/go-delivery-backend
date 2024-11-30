import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { IListener } from '../../../common/infrastructure/Event-listener/event-listener.interface';
import { MailSenderService } from '../../../common/infrastructure/providers/services/emailProvider.service';
import { S3Service } from 'src/common/infrastructure/providers/services/s3.service';
import { EventStorageMongoService } from '../../../common/infrastructure/mongo-event/mongo-event.service';
import { DomainEventBase } from '../../../common/domain/domain-event';
import { TemplateHandler } from 'src/common/application/html-formater/html-forgot-password.formater.service';

@Controller()
export class CreateProductConsumerService<T> implements IListener<T> {
  private readonly logo = 'https://godely.s3.us-east-1.amazonaws.com/logoGodely.jpg';
  private readonly nuevoProducto = 'https://godely.s3.us-east-1.amazonaws.com/nuevoProducto.jpg';

  constructor(
    private readonly mailService: MailSenderService,
    private readonly eventStorageMongoService: EventStorageMongoService,
    private readonly s3Service: S3Service,
  ) {}

  @EventPattern('ProductCreatedEvent')
  async handle(@Payload() data: T, @Ctx() context: RmqContext) {
    console.log(data);
    try {
      const nuevoProducto = await this.saveEvent(data);
      const producto = await this.mapProductCreatedEvent(data);
      await this.mailService.sendEmailforAllUsers(`Excelentes Noticias! ${producto.name} esta aquí!`, await this.getHtml(producto, this.logo, this.nuevoProducto));
    } catch (error) {
      throw new Error(error);
    }
  }

  async saveEvent(event) {
    const DomainEventBase: DomainEventBase = {
      name: event.eventName,
      timestamp: event.ocurredOn,
      data: {
        id: event.id._id,
        description: event.description._description,
        currency: event.currency._currency,
        price: event.price._price,
        stock: event.stock._stock,
        weight: event.weight._weight,
        imageUrl: event.imageUrl.url,
        categories: event.categories.map(category => category._category),
      },
    };
    await this.eventStorageMongoService.save(DomainEventBase);
  }

  async mapProductCreatedEvent(event) {
    return {
      name: event.name?._name || null,
      description: event.description?._description || null,
      currency: event.currency?._currency || null,
      price: event.price?._price || null,
      imageUrl: await this.s3Service.getFile(event.imageUrl.url),
    };
  }

  async getHtml(producto, logo, nuevoProducto): Promise<string> {
    console.log(producto, logo, nuevoProducto);
    return await TemplateHandler.generateTemplate('src/templates/newProduct.html', {
      logo: logo,
      nuevoProducto: nuevoProducto,
      producto_imageUrl: producto.imageUrl,
      producto_name: producto.name,
      producto_price: producto.price,
      producto_description: producto.description,
    });
  }
}
