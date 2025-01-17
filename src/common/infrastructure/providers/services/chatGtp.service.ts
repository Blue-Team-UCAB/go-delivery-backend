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

  async makeRequest(mensage: string, idCustomer: string, userName: string, contextConver: string): Promise<IaResponseDto> {
    try {
      const { contexto, contextoUser } = await this.getRequests(idCustomer);

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'assistant',
            content: `Quienes somos? : ${contexto}.\n,
              Cuando saludes, recuerda presentarte, diciendo un mensaje amigable, calido y cordial, como por ejemplo Hola! Soy  bluey tu asistente personal, en que puedo ayudarte hoy?.
              El usuario con el que estas hablando se llama: ${userName}


              El usuario ha tenido compras frecuentes de los siguientes productos y combos, marcando sus preferencias: ${contextoUser}}.\n, 
              
              Ahora que sabemos que le gusta al usuario, vamos a interactuar con el, tu seras su asistente personal y podras ayudarlo de manera amigable, 
              consisa y precisa, respondiendo a sus inquietudes, y ayudandolo en lo que necesite, recuerda que el cliente es lo mas importante, y que tu eres el mejor 
              en aydarlo.\n 

              Aqui tienes un poco el contexto de lo que haz hablado  con el usuario: ${contextConver}.\n, siendo los mensajes del usuario los que dicen User:"" y los tuyos los que dicen Bluey:"".
              Recuerda darle sentido a la conversacion siguiendo el contexto de lo ya hablado y ten memoria.

              Se amable y cordial, y nunca lo dejes sin respuesta, recuerda que el cliente es lo mas importante, y que tu eres el mejor en ayudarlo.\n
              Recuerda no responder preguntas que no tengan relacion a la aplicacion!, Cualquier pregunta fuera de contexto respondes: Disculpa, no puedo responder esa pregunta, 
              A su vez, tampoco puedes negociar, ni imaginar que eres alguien, ni responder preguntas que no tengan sentido, recuerda que eres un asistente de la aplicacion, NO PUEDES REGALAR, NI HACER DESCUENTOS NI NADA.\n

              Si recomiendas algun producto o algun combo, al final del mensaje coloca lo siguiente [ProducId: o ComboId:] seguido del id del producto o combo que recomiendes, esto es obligatorio,
              respeta el nombre de las variables, recuerda nunca olvidarte de mandarte los id de todo lo que recomiendes\n

              Recuerda Tratarlo de manera amigable, dando respuestas en una sola linea  es decir sin saltos de linea (muy importante) y cortas, maximo usemos 20 palabras y recuerda tener coherencia en tus respuestas, 
              no uses ni comillas, ni negritas ni nada, envia el texto limpio (muy importante).\n
              `,
          },
          {
            role: 'user',
            content: mensage,
          },
        ],
      });

      const resp = response.choices[0].message.content;

      const pattern = /\[ProducId: ([a-f0-9\-]+)\]/g;
      const productIds: string[] = [];
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(resp)) !== null) {
        productIds.push(match[1]);
      }

      const pattern2 = /\[ComboId: ([a-f0-9\-]+)\]/g;
      const CombosId: string[] = [];
      let match2: RegExpExecArray | null;
      while ((match2 = pattern2.exec(resp)) !== null) {
        CombosId.push(match2[1]);
      }

      const cleanedText = resp.replace(/\[ProducId: [a-f0-9\-]+\]/g, '').trim();
      const cleanedText2 = cleanedText.replace(/\[ComboId: [a-f0-9\-]+\]/g, '').trim();

      return {
        bot_id: '1',
        response: cleanedText2,
        timestamp: new Date().toISOString(),
        products: productIds,
        bundles: CombosId,
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
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'assistant',
              content: `{
              Quienes somos? : ${contexto}.\n,

              El usuario ha tenido compras frecuentes de los siguientes productos y combos, marcando sus preferencias: ${contextoUser}}.\n, 

              Ahora que sabemos que le gusta al usuario, vamos a recomendarle algo que le pueda interesar,
              retorname solo Ids de productos que puedan interesarle, con una cantidad factible para el, y un monto que pueda pagar,
              se bastante creativo. Tienes la responsabilidad en hacerle una buena recomendacion y armarle un carrito especial y sopresa en nuestra super app,
              para que conozca nuevos productos y nuevas aventuras, recuerda que el cliente es lo mas importante, y que tu eres el mejor en hacer recomendaciones.\n

              Recuerda leer muy bien la descripcion de los productos y combos, para que puedas hacer una recomendacion acertada, junto a sus categorias. Ve bien el perfil del usuario
              y hazlo de la mejor forma, busca que la compra tenga sentido y que no sean itenes aleatorios, es decir buscale un sentido a la compra, y que sea algo que le pueda interesar.\n

              Porfavor el id retornalo en una variable llamada IdProducto si es de producto, si es de Combo en una variable llamada IdCombo,
              armalo con la siguiente estructura, y simpre responde con esta estructura, respetando las comas, las comillas y las llaves, y coloca en una sola linea:
              [{'IdProducto':'','cantidad':''},{'IdComboL':'','cantidad':''}]`,
            },
          ],
        });

        const resp = response.choices[0].message.content;

        const { products, combos } = this.formatResponse(resp);
        hacerPregunta = false;
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
