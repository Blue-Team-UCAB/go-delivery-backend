import { UserType } from 'src/auth/application/model/user-model';

export interface AuthInterface {
  idUser: string;
  emailUser: string;
  roleUser: UserType;
  idCostumer: string;
  idStripe: string;
  linkedDivices: string[];
  customerName: string;
}
