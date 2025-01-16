import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { IListener } from 'src/common/infrastructure/Event-listener/event-listener.interface';
import axios from 'axios';

@Controller()
export class OrderVectorModifyService<T extends { id: string; customerId: string }> implements IListener<T> {
  @EventPattern('OrdenVectorModify')
  async handle(@Payload() data: T, @Ctx() context: RmqContext) {
    const url = `https://admin.godely.net/api/orden/orden`;
    const apiResponse = await axios.post(url, data);
    if (apiResponse.status !== 200) {
      throw new Error('Error al obtener la ruta de Google Maps');
    }
  }
}
