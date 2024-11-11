export const userTypes = ['ADMIN', 'CLIENT'] as const;

export type UserType = (typeof userTypes)[number];

export type User = {
  idUser: string;
  nameUser: string;
  emailUser: string;
  passwordUser: string;
  roleUser: UserType;
  phoneUser: string;
  birthdateUser: Date;
};
