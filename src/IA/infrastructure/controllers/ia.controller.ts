import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { ChatGptService } from 'src/common/infrastructure/providers/services/chatGtp.service';
import { IaMakeRequestDto } from '../dto/ia-make-request.dto';
import { IaResponseDto } from 'src/common/application/IA-Service/Ia-response.dto';
import { IsClientOrAdmin } from 'src/auth/infrastructure/jwt/decorator/isClientOrAdmin.decorator';
import { UseAuth } from 'src/auth/infrastructure/jwt/decorator/useAuth.decorator';
import { GetUser } from 'src/auth/infrastructure/jwt/decorator/get-user.decorator';
import { AuthInterface } from 'src/common/infrastructure/auth-interface/aunt.interface';
import { GetProductByPageApplicationService } from 'src/product/application/queries/get-product-page.application.service';
import { ProductRepository } from 'src/product/infrastructure/repository/product.repository';
import { DiscountRepository } from 'src/discount/infrastructure/repository/discount.repository';
import { BestForTheCustomerStrategy } from 'src/common/infrastructure/select-discount-strategies/best-for-the-customer-strategy';
import { DateService } from 'src/common/infrastructure/providers/services/date.service';
import { S3Service } from 'src/common/infrastructure/providers/services/s3.service';
import { DataSource } from 'typeorm';
import { GetBundleByPageApplicationService } from 'src/bundle/application/queries/get-bundle-page.application.service';
import { BundleRepository } from 'src/bundle/infrastructure/repository/bundle.repository';

@ApiExcludeController()
@ApiTags('IA')
@Controller('ia')
export class IAController {
  private readonly ia_Service: ChatGptService;
  private readonly productRepository: ProductRepository;
  private readonly discountRepository: DiscountRepository;
  private readonly bundleRepository: BundleRepository;

  constructor(
    @Inject('BaseDeDatos')
    private readonly dataSource: DataSource,
    private readonly bestForTheCustomerStrategy: BestForTheCustomerStrategy,
    private readonly s3Service: S3Service,
    private readonly dateService: DateService,
  ) {
    this.ia_Service = new ChatGptService();
    this.productRepository = new ProductRepository(this.dataSource);
    this.discountRepository = new DiscountRepository(this.dataSource);
    this.bundleRepository = new BundleRepository(this.dataSource);
  }
  @Post('make/request')
  @ApiBody({ type: IaMakeRequestDto })
  @ApiBearerAuth()
  @UseAuth()
  @IsClientOrAdmin()
  async makeRequest(@Body() message: IaMakeRequestDto, @GetUser() user: AuthInterface) {
    try {
      const response = await this.ia_Service.makeRequest(message.message, user.idCostumer);
      return response;
    } catch (error) {
      throw new Error('Error in the request');
    }
  }

  @Post('random/card')
  @ApiBearerAuth()
  @UseAuth()
  @IsClientOrAdmin()
  async randomCard(@GetUser() user: AuthInterface) {
    try {
      const { products, combos } = await this.ia_Service.getCard(user.idCostumer);

      let productsResponseWithQuantity = [];
      let combosResponseWithQuantity = [];

      if (products.length > 0) {
        const service = new GetProductByPageApplicationService(this.productRepository, this.discountRepository, this.bestForTheCustomerStrategy, this.s3Service, this.dateService);
        const response = await service.execute({ page: 1, perpage: 1000 });
        const productsResponse = response.Value.filter(product => products.some(p => p.idProduct === product.id));
        productsResponseWithQuantity = productsResponse.map(product => {
          const matchingProduct = products.find(p => p.idProduct === product.id);
          return {
            ...product,
            cantidad: matchingProduct ? matchingProduct.cantidad : 0, // Añadimos la cantidad si existe, 0 si no
          };
        });
      }

      if (combos.length > 0) {
        const serviceCombo = new GetBundleByPageApplicationService(this.bundleRepository, this.discountRepository, this.bestForTheCustomerStrategy, this.s3Service, this.dateService);
        const responseCombo = await serviceCombo.execute({ page: 1, perpage: 1000 });
        const combosResponse = responseCombo.Value.filter(combo => combos.some(c => c.idCombo === combo.id));
        combosResponseWithQuantity = combosResponse.map(combo => {
          const matchingCombo = combos.find(c => c.idCombo === combo.id);
          return {
            ...combo,
            cantidad: matchingCombo ? matchingCombo.cantidad : 0, // Añadimos la cantidad si existe, 0 si no
          };
        });
      }

      return { products: productsResponseWithQuantity, combos: combosResponseWithQuantity };
    } catch (error) {
      throw new Error('Error in the request');
    }
  }
}
