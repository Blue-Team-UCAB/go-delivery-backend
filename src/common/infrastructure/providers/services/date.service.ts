import { Injectable } from '@nestjs/common';
import { IDateService } from '../../../application/date-service/date-service.interface';
import { DateTime } from 'luxon';

@Injectable()
export class DateService implements IDateService {
  now(): Date {
    return DateTime.now().setZone('America/Caracas').toFormat('yyyy-MM-dd HH:mm:ss');
  }

  getNowPlusMinutes(minutes: number): Date {
    return DateTime.now().plus({ minutes }).setZone('America/Caracas').toFormat('yyyy-MM-dd HH:mm:ss');
  }

  toUtcMinus4(date: Date): Date {
    return DateTime.fromJSDate(date).setZone('America/Caracas').toFormat('yyyy-MM-dd HH:mm:ss');
  }
}
