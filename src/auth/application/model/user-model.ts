export const userTypes = ['ADMIN', 'CLIENT'] as const;

export type UserType = (typeof userTypes)[number];

export type User = {
  idUser: string;
  emailUser: string;
  passwordUser: string;
  roleUser: UserType;
  costumerId: string;
  expirationCodeDate?: Date | null;
  verificationCode?: string | null;
};
