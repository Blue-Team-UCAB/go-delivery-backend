import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { ChatGptService } from 'src/common/infrastructure/providers/services/chatGtp.service';
import { IaMakeRequestDto } from '../dto/ia-make-request.dto';
import { IaResponseDto } from 'src/common/application/IA-Service/Ia-response.dto';
import { IsClientOrAdmin } from 'src/auth/infrastructure/jwt/decorator/isClientOrAdmin.decorator';
import { UseAuth } from 'src/auth/infrastructure/jwt/decorator/useAuth.decorator';
import { GetUser } from 'src/auth/infrastructure/jwt/decorator/get-user.decorator';
import { AuthInterface } from 'src/common/infrastructure/auth-interface/aunt.interface';

@ApiExcludeController()
@ApiTags('IA')
@Controller('ia')
export class IAController {
  private readonly ia_Service: ChatGptService;

  constructor() {
    this.ia_Service = new ChatGptService();
  }
  @Post('make/request')
  @ApiBody({ type: IaMakeRequestDto })
  @ApiBearerAuth()
  @UseAuth()
  @IsClientOrAdmin()
  async makeRequest(@Body() message: IaMakeRequestDto, @GetUser() user: AuthInterface) {
    try {
      const response = await this.ia_Service.makeRequest(message.mensage, user.idCostumer);
      return response;
    } catch (error) {
      console.log(error);
      throw new Error('Error in the request');
    }
  }
}
