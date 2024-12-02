import { ValueObject } from '../../../common/domain/value-object';
import { InvalidOrderReportException } from '../exceptions/invalid-order-report.exception';

export class OrderReport implements ValueObject<OrderReport> {
  private readonly _claimDate: Date;
  private readonly _claim: string;

  constructor(claimDate: Date, claim: string) {
    if (!claimDate || !(claimDate instanceof Date)) throw new InvalidOrderReportException(`Claim date ${claimDate} is not valid`);
    if (!claim || typeof claim !== 'string' || claim.trim().length === 0) throw new InvalidOrderReportException(`Claim ${claim} is not valid`);
    this._claimDate = claimDate;
    this._claim = claim.trim();
  }

  equals(obj: OrderReport): boolean {
    return this._claimDate.getTime() === obj._claimDate.getTime() && this._claim === obj._claim;
  }

  get claimDate(): Date {
    return this._claimDate;
  }

  get claim(): string {
    return this._claim;
  }

  static create(claimDate: Date, claim: string): OrderReport {
    return new OrderReport(claimDate, claim);
  }
}
