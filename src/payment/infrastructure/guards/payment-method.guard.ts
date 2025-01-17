import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Inject } from '@nestjs/common';
import { PaymentMethodRepository } from '../repository/payment-method.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class PaymentMethodGuard implements CanActivate {
  private paymentMethodService: PaymentMethodRepository;
  constructor(
    @Inject('BaseDeDatos')
    private readonly dataSource: DataSource,
  ) {
    this.paymentMethodService = new PaymentMethodRepository(this.dataSource);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const url = request.url;

    const paymentMethodsResult = await this.paymentMethodService.getPaymentMethods();

    if (!paymentMethodsResult.isSuccess()) {
      throw new ForbiddenException('No se pudo verificar los métodos de pago');
    }

    const paymentMethods = paymentMethodsResult.Value;
    const matchingMethod = paymentMethods.find(method => url.includes(method.name_PaymentMethod.toLowerCase().replace(' ', '-')));

    if (!matchingMethod) {
      throw new ForbiddenException('Método de pago no reconocido');
    }

    if (!matchingMethod.state_PaymentMethod) {
      throw new ForbiddenException(`${matchingMethod.name_PaymentMethod} está temporalmente deshabilitado`);
    }

    return true;
  }
}
