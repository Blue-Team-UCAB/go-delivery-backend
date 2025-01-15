import { IaResponseDto } from './Ia-response.dto';

export interface IIaService {
  makeRequest(message: string): Promise<IaResponseDto>;
}
