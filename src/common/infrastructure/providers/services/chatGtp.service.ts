import { OpenAI } from 'openai';
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

  async makeRequest(mensage: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.',
          },
        ],
      });
      const resp = response.choices[0].message.content;
      return resp;
    } catch (error) {
      console.log(error);
      throw new Error('Error in the request');
    }
  }
}
