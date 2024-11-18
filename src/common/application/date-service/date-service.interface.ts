export interface IDateService {
  now(): Date;
  getNowPlusMinutes(minutes: number): Date;
}
