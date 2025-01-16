import { OpenAI } from 'openai';
import { IaResponseDto } from 'src/common/application/IA-Service/Ia-response.dto';
import { ComboDtoIA, IIaService, ProdcutDtoIA } from 'src/common/application/IA-Service/IIAService.interface';
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

  async getCard(idCustomer: string): Promise<{ products: ProdcutDtoIA[]; combos: ComboDtoIA[] }> {
    let hacerPregunta = true;

    while (hacerPregunta) {
      try {
        const { contexto, contextoUser } = await this.getRequests(idCustomer);

        const response = await this.openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `{Contexto: ${contexto}.\n,
              El usuario ha tenido compras frecuentes de los siguientes productos y combos, marcando sus preferencias: ${contextoUser}}.\n, 

              Ahora que sabemos que le gusta al usuario, vamos a recomendarle algo que le pueda interesar,
              retorname solo Ids de productos que puedan interesarle, con una cantidad factible para el, y un monto que pueda pagar,
              se bastante creativo. Tienes la responsabilidad en hacerle una buena recomendacion y armarle un carrito especial y sopresa en nuestra super app,
              para que conozca nuevos productos y nuevas aventuras, recuerda que el cliente es lo mas importante, y que tu eres el mejor en hacer recomendaciones,

              Porfavoe el id retornalo en una variable llamada IdProducto si es de producto, si es de Combo en una variable llamada IdCombo,
              armalo con la siguiente estructura, y simpre responde con esta estructura, respetando las comas, las comillas y las llaves, y coloca en una sola linea:
              [{'IdProducto':'','cantidad':''},{'IdComboL':'','cantidad':''}]`,
            },
          ],
        });

        const resp = response.choices[0].message.content;

        const { products, combos } = this.formatResponse(resp);
        hacerPregunta = false;
        console.log(products, combos);
        return { products, combos };
      } catch (error) {
        continue;
      }
    }
  }

  formatResponse(response: string): { products: ProdcutDtoIA[]; combos: ComboDtoIA[] } {
    try {
      const responseParsed: any[] = JSON.parse(response.replace(/'/g, '"'));

      const products: ProdcutDtoIA[] = [];
      const combos: ComboDtoIA[] = [];

      responseParsed.forEach((element: any) => {
        if (element.IdProducto) {
          products.push({
            idProduct: element.IdProducto,
            cantidad: parseInt(element.cantidad, 10),
          });
        } else if (element.IdCombo) {
          combos.push({
            idCombo: element.IdCombo,
            cantidad: parseInt(element.cantidad, 10),
          });
        }
      });

      return { products, combos };
    } catch (error) {
      throw new Error('Error al parsear la respuesta');
    }
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
