export interface GetCouponIdServiceResponseDto {
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
  customer: {
    id_customer: string;
    remaining_uses: number;
  }[];
}
