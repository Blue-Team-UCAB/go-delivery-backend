export interface IDateService {
  now(): Date;
  getNowPlusMinutes(minutes: number): Date;
  toUtcMinus4(date: Date): Date;
}
