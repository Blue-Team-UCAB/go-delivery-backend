export interface CreateCouponServiceEntryDto {
  startDate: Date;
  expirationDate: Date;
  porcentage: number;
  code: string;
  title: string;
  message: string;
  numberUses: number;
}
