import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { IListener } from '../../../common/infrastructure/Event-listener/event-listener.interface';
import { MailSenderService } from '../../../common/infrastructure/providers/services/emailProvider.service';
import { S3Service } from 'src/common/infrastructure/providers/services/s3.service';
import { EventStorageMongoService } from '../../../common/infrastructure/mongo-event/mongo-event.service';
import { DomainEventBase } from '../../../common/domain/domain-event';

@Controller()
export class CreateProductConsumerService<T> implements IListener<T> {
  constructor(
    private readonly mailService: MailSenderService,
    private readonly s3Service: S3Service,
    private readonly eventStorageMongoService: EventStorageMongoService,
  ) {}

  @EventPattern('ProductCreatedEvent')
  async handle(@Payload() data: T, @Ctx() context: RmqContext) {
    try {
      const logo = await this.s3Service.getFile('logoGodely.jpg');
      const nuevoProducto = await this.s3Service.getFile('nuevoProducto.jpg');
      await this.saveEvent(data);
      const producto = await this.mapProductCreatedEvent(data);
      this.mailService.sendEmailforAllUsers(`Exciting News! ${producto.name} is Here!`, this.getHtml(producto, logo, nuevoProducto));
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

  getHtml(producto, logo, nuevoProducto): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Product Section</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f4f4; margin: 0; padding: 0;">
            <tr>
                <td align="center" style="padding: 20px 0;">
                    <table width="480" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; font-family: Arial, sans-serif;">
                        <tr>
                            <td align="center" style="padding: 20px;">
                                <img src=${logo} alt="Company logo" width="54" style="display: block;">
                            </td>
                        </tr>
                        <tr>
                            <td align="center">
                                <img src=${nuevoProducto} alt="Product showcase" width="100%" style="display: block;">
                            </td>
                        </tr>
                         <tr>
                        <td align="center" style="padding: 20px;">
                            <table width="100%" cellspacing="0" cellpadding="0" border="0" style="table-layout: fixed;">
                                <tr>
                                    <td align="center" style="width: 50%; padding: 10px; vertical-align: middle;">
                                        <img src=${producto.imageUrl} alt="${producto.name}" width="150" style="display: block; max-width: 100%;">
                                    </td>
                                    <td align="center" style="width: 50%; padding: 10px; vertical-align: middle; text-align: center;">
                                        <p style="margin: 0; font-size: 16px; font-weight: bold; color: #000;">${producto.name}</p>
                                        <p style="margin: 8px 0 0 0; font-size: 24px; font-weight: bold; color: #857cb1;">${producto.price}$</p>
                                        <p style="margin: 8px 0 0 0; font-size: 12px; color: #666;">${producto.description}</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                        <tr>
                            <td align="center" style="padding: 20px; font-size: 20px; font-weight: normal; color: #1f2024;">
                                Todos tus pedidos <br> en un solo lugar
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 20px;">
                                <a href="http://www.godely_blue.com/" style="display: inline-block; background-color: #2000b1; color: #ffffff; text-decoration: none; padding: 15px 100px; font-size: 14px; font-weight: bold; border-radius: 8px;">
                                    Compra ahora
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 20px; background-color: #020035; color: #ffffff; font-size: 14px;">
                                ©BlueTeam
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
  }
}
