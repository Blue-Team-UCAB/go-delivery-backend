import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatGptService } from 'src/common/infrastructure/providers/services/chatGtp.service';
import { IaMakeRequestDto } from '../dto/ia-make-request.dto';
import { IaResponseDto } from 'src/common/application/IA-Service/Ia-response.dto';

@ApiTags('IA')
@Controller('ia')
export class IAController {
  private readonly ia_Service: ChatGptService;

  constructor() {
    this.ia_Service = new ChatGptService();
  }
  @Post('make/request')
  async makeRequest(@Body() message: IaMakeRequestDto) {
    try {
      const response = await this.ia_Service.makeRequest(message.mensage);
      return response;
    } catch (error) {
      console.log(error);
      throw new Error('Error in the request');
    }
  }
}
