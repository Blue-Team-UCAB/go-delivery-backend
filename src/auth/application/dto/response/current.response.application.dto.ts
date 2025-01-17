export interface CurrentResponseServiceDto {
  id: string;
  email: string;
  name: string;
  phone: string;
  type: string;
  image: string;
  wallet: {
    walletId: string;
    Ballance: {
      amount: number;
      currency: string;
    };
  };
}
