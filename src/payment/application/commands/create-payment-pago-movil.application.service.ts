import { IApplicationService } from 'src/common/application/application-services/application-service.interface';
import { CreatePaymentPagoMovilEntryDto } from '../dto/entry/create-payment-pago-movil.entry.dto';
import { CreatePaymentResponseDto } from '../dto/response/create-payment.response.dto';
import { Result } from 'src/common/domain/result-handler/result';

export class CreatePaymentPagoMovilApplicationService implements IApplicationService<CreatePaymentPagoMovilEntryDto, CreatePaymentResponseDto> {
  execute(data: CreatePaymentPagoMovilEntryDto): Promise<Result<CreatePaymentResponseDto>> {
    throw new Error('Method not implemented.');
  }
}
