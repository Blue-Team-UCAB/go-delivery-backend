import { IaResponseDto } from './Ia-response.dto';
export interface ProdcutDtoIA {
  idProduct: string;
  cantidad: number;
}

export interface ComboDtoIA {
  idCombo: string;
  cantidad: number;
}
export interface IIaService {
  makeRequest(message: string, idCustomer: string, userName: string): Promise<IaResponseDto>;
  getCard(idCustomer: string): Promise<{ products: ProdcutDtoIA[]; combos: ComboDtoIA[] }>;
}
