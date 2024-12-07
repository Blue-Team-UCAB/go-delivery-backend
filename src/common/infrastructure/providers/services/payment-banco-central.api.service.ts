import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ApiBCV {
  constructor(private httpService: HttpService) {}

  async getDolar() {
    try {
      const url = 'https://ve.dolarapi.com/v1/dolares';
      const response = await firstValueFrom(this.httpService.get(url));
      const { data } = response;
      return data[0].promedio;
    } catch (error) {
      throw error;
    }
  }
}
