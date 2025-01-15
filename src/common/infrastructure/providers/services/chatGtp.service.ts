import { OpenAI } from 'openai';
import { IaResponseDto } from 'src/common/application/IA-Service/Ia-response.dto';
import { IIaService } from 'src/common/application/IA-Service/IIAService.interface';

export class ChatGptService implements IIaService {
  private readonly openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      organization: process.env.openIA_organization,
      project: process.env.openIA_project,
      apiKey: process.env.openIA_api_key,
    });
  }

  async makeRequest(mensage: string): Promise<IaResponseDto> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Siempre contestas en Espanol, eres un asistente de una app de delivery.',
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
