export interface IDateService {
  now(): Promise<Date>;
  getNowPlusMinutes(minutes: number): Promise<Date>;
  toUtcMinus4(date: Date): Promise<Date>;
}
