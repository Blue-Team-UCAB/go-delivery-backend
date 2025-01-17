export interface GetApplicableCouponsByCustomerServiceResponseDto {
  coupons: {
    id: string;
    expirationDate: Date;
    porcentage: number;
    code: string;
    numberUses: number;
  }[];
}
