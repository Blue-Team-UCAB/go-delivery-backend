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
      const { contexto, contextoUser } = await this.getRequests(idCustomer);

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
        bot_id: '1',
        response: resp,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.log(error);
      throw new Error('Error in the request');
    }
  }

  async getCard(idCustomer: string): Promise<IaResponseDto> {
    const { contexto, contextoUser } = await this.getRequests(idCustomer);

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `{contexto: ${contexto},el usuario ha tenido compras frecuentes de : ${contextoUser}}, 
          retorname solo Ids de productos que puedan interesarle al usuario, con una cantidad que le pueda interesar, es para hacerle una recomendacion y armarle un carrito,
           el id retornalo en una variable llamada IdProducto si es de producto, si es de Combo en una variable llamada IdCombo, junto a la cantidad de cada uno. 
           armalo con la siguiente estructura:
           {productos:{[IdProducto:'',cantidad:'']},combos:{[IdComboL:'',cantidad:'']}}`,
        },
      ],
    });
    const resp = response.choices[0].message.content;

    return {
      bot_id: '1',
      response: resp,
      timestamp: new Date().toISOString(),
    };
  }
  catch(error) {
    console.log(error);
    throw new Error('Error in the request');
  }

  async getRequests(idCustomer: string): Promise<{ contexto: string; contextoUser: string }> {
    const url = `https://admin.godely.net/api/get/context/${idCustomer}`;
    const apiResponse = await axios.get(url);
    if (apiResponse.status !== 200) {
      throw new Error('Error al obtener la ruta de Google Maps');
    }
    const contexto = apiResponse.data.contexto;
    const contextoUser = apiResponse.data.contexto_Customer;

    return { contexto, contextoUser };
  }
}
