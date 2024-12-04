export interface CreateCouponServiceResponseDto {
  id: string;
  startDate: Date;
  expirationDate: Date;
  porcentage: number;
  code: string;
  message: {
    title: string;
    message: string;
  };
  numberUses: number;
}
