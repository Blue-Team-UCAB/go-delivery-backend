import { Injectable } from '@nestjs/common';
import { IDateService } from '../../../application/date-service/date-service.interface';
import { DateTime } from 'luxon';

@Injectable()
export class DateService implements IDateService {
  async now(): Promise<Date> {
    return await DateTime.now().setZone('America/Caracas').toFormat('yyyy-MM-dd HH:mm:ss');
  }

  async getNowPlusMinutes(minutes: number): Promise<Date> {
    return await DateTime.now().plus({ minutes }).setZone('America/Caracas').toFormat('yyyy-MM-dd HH:mm:ss');
  }

  async toUtcMinus4(date: Date): Promise<Date> {
    return await DateTime.fromJSDate(date).setZone('America/Caracas').toFormat('yyyy-MM-dd HH:mm:ss');
  }
}
