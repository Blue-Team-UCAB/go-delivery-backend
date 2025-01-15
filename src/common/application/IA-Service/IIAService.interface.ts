export interface IIaService {
  makeRequest(message: string): Promise<string>;
}
