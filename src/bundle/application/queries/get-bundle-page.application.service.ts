import { Injectable } from '@nestjs/common';
import { IApplicationService } from '../../../common/application/application-services/application-service.interface';
import { GetBundlePageServiceEntryDto } from '../dto/entry/get-bundle-page-service-entry.dto';
import { GetBundlePageServiceResponseDto } from '../dto/response/get-bundle-page-service-response.dto';
import { Result } from '../../../common/domain/result-handler/result';
import { IBundleRepository } from '../../domain/repositories/bundle-repository.interface';
import { Bundle } from '../../domain/bundle';
import { IStorageS3Service } from '../../../common/application/s3-storage-service/s3.storage.service.interface';
import { BundleProductResponseDto } from '../dto/response/bundle-product-response.dto';
import { BundleProduct } from '../../domain/entities/bundle-product';
import { BundleEntity } from '../../domain/entities/bundle';

@Injectable()
export class GetBundleByPageApplicationService implements IApplicationService<GetBundlePageServiceEntryDto, GetBundlePageServiceResponseDto> {
  constructor(
    private readonly bundleRepository: IBundleRepository,
    private readonly s3Service: IStorageS3Service,
  ) {}

  async execute(data: GetBundlePageServiceEntryDto): Promise<Result<GetBundlePageServiceResponseDto>> {
    const bundleResult: Result<Bundle[]> = await this.bundleRepository.findAllBundles(data.page, data.take);

    if (!bundleResult.isSuccess) {
      return Result.fail(bundleResult.Error, bundleResult.StatusCode, bundleResult.Message);
    }

    const bundlesWithImages = await Promise.all(
      bundleResult.Value.map(async bundle => {
        const imageUrl: string = await this.s3Service.getFile(bundle.ImageUrl.Url);
        const products: BundleProductResponseDto[] = bundle.Products.map(product => {
          if (product instanceof BundleProduct) {
            return {
              id: product.Id.Id,
              name: product.Name.Name,
              price: product.Price.Price,
              weight: product.Weight.Weight,
              quantity: product.Quantity.Quantity,
              type: 'product' as const,
            };
          } else if (product instanceof BundleEntity) {
            return {
              id: product.Id.Id,
              name: product.Name.Name,
              price: product.Price.Price,
              weight: product.Weight.Weight,
              quantity: product.Quantity.Quantity,
              type: 'bundle' as const,
            };
          }
          return null;
        }).filter(product => product !== null);

        return {
          id: bundle.Id.Id,
          name: bundle.Name.Name,
          description: bundle.Description.Description,
          currency: bundle.Currency.Currency,
          price: bundle.Price.Price,
          stock: bundle.Stock.Stock,
          weight: bundle.Weight.Weight,
          imageUrl: imageUrl,
          caducityDate: bundle.CaducityDate.CaducityDate,
          products: products,
        };
      }),
    );

    const response: GetBundlePageServiceResponseDto = {
      bundles: bundlesWithImages,
    };

    return Result.success(response, 200);
  }
}