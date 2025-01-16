import { OpenAI } from 'openai';
import { IaResponseDto } from 'src/common/application/IA-Service/Ia-response.dto';
import { IIaService } from 'src/common/application/IA-Service/IIAService.interface';
import axios from 'axios';

export class ChatGptService implements IIaService {
  private readonly openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      organization: process.env.openIA_organization,
      project: process.env.openIA_project,
      apiKey: process.env.openIA_api_key,
    });
  }

  async makeRequest(mensage: string, idCustomer: string): Promise<IaResponseDto> {
    try {
      const url = `https://admin.godely.net/api/get/context/${idCustomer}`;
      const apiResponse = await axios.get(url);

      if (apiResponse.status !== 200) {
        throw new Error('Error al obtener la ruta de Google Maps');
      }

      const contexto = apiResponse.data.contexto;
      const contextoUser = apiResponse.data.contexto_Customer;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `{contexto: ${contexto},el usuario ha tenido compras frecuentes de : ${contextoUser}}, 
            ayudalo recomendadole cosas que le puedan interesar, siempre y cuando te pregunta, lleva la conversacion de manera natural, se consiso y breve`,
          },
          {
            role: 'user',
            content: mensage,
          },
        ],
      });
      const resp = response.choices[0].message.content;

      return {
        response: resp,
      };
    } catch (error) {
      console.log(error);
      throw new Error('Error in the request');
    }
  }
}
