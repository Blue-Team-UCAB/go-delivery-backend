import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { IListener } from '../../../common/infrastructure/Event-listener/event-listener.interface';
import { MailSenderService } from '../../../common/infrastructure/providers/services/emailProvider.service';
import { S3Service } from 'src/common/infrastructure/providers/services/s3.service';

@Controller()
export class CreateProductConsumerService<T> implements IListener<T> {
  constructor(
    private readonly mailService: MailSenderService,
    private readonly s3Service: S3Service,
  ) {}

  @EventPattern('ProductCreatedEvent')
  async handle(@Payload() data: T, @Ctx() context: RmqContext) {
    try {
      const producto = await this.mapProductCreatedEvent(data);
      this.mailService.sendEmailforAllUsers(`Exciting News! ${producto.name} is Here!`, this.getHtml(producto));
    } catch (error) {
      console.log(error);
    }
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

  getHtml(producto): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Product Notification</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9; color: #333; }
          .email-container { max-width: 600px; margin: 20px auto; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
          .header { background-color: #007bff; color: #ffffff; text-align: center; padding: 15px; font-size: 22px; font-weight: bold; }
          .content { padding: 20px; line-height: 1.6; }
          .content h2 { font-size: 18px; color: #007bff; margin-top: 0; }
          .content p { font-size: 16px; margin: 10px 0; }
          .content .product-image { text-align: center; margin: 20px 0; }
          .content .product-image img { max-width: 100%; height: auto; border-radius: 8px; }
          .button { display: block; width: 100%; text-align: center; margin: 20px 0; }
          .button a { text-decoration: none; background-color: #007bff; color: #ffffff; padding: 10px 20px; border-radius: 5px; font-size: 16px; font-weight: bold; }
          .button a:hover { background-color: #0056b3; }
          .footer { background-color: #f9f9f9; text-align: center; padding: 15px; font-size: 14px; color: #666; }
          .footer a { color: #007bff; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            🎉 New Product Available!
          </div>
          <div class="content">
            <h2>Introducing: ${producto.name}</h2>
            <p>${producto.description}</p>
            <p><strong>Price:</strong> ${producto.currency} ${producto.price}</p>
            <div class="product-image">
              <img src="${producto.imageUrl}" alt="${producto.name}">
            </div>
            <div class="button">
              <a href="#">Learn More</a>
            </div>
          </div>
          <div class="footer">
            <p>Thank you for shopping with GoDely!</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
