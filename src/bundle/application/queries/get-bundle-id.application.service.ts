// src/bundle/application/services/get-bundle-id-application.service.ts
import { Injectable } from '@nestjs/common';
import { IApplicationService } from '../../../common/application/application-services/application-service.interface';
import { GetBundleIdServiceResponseDto } from '../dto/response/get-bundle-id-service.response.dto';
import { GetBundleIdServiceEntryDto } from '../dto/entry/get-bundle-id-service.entry.dto';
import { Result } from '../../../common/domain/result-handler/result';
import { IBundleRepository } from '../../domain/repositories/bundle-repository.interface';
import { Bundle } from '../../domain/bundle';
import { IStorageS3Service } from '../../../common/application/s3-storage-service/s3.storage.service.interface';
import { BundleProductResponseDto } from '../dto/response/bundle-product-response.dto';
import { BundleProduct } from '../../domain/entities/bundle-product';
import { BundleEntity } from '../../domain/entities/bundle';

@Injectable()
export class GetBundleByIdApplicationService implements IApplicationService<GetBundleIdServiceEntryDto, GetBundleIdServiceResponseDto> {
  constructor(
    private readonly bundleRepository: IBundleRepository,
    private readonly s3Service: IStorageS3Service,
  ) {}

  async execute(data: GetBundleIdServiceEntryDto): Promise<Result<GetBundleIdServiceResponseDto>> {
    const bundleResult: Result<Bundle> = await this.bundleRepository.findBundleById(data.id);

    if (!bundleResult.isSuccess) {
      return Result.fail(bundleResult.Error, bundleResult.StatusCode, bundleResult.Message);
    }

    const imageUrl: string = await this.s3Service.getFile(bundleResult.Value.ImageUrl.Url);

    const products: BundleProductResponseDto[] = await Promise.all(
      bundleResult.Value.Products.map(async product => {
        let imageUrlBundle: string = '';
        if (product instanceof BundleProduct) {
          imageUrlBundle = await this.s3Service.getFile(product.Image.Url);
          return {
            id: product.Id.Id,
            name: product.Name.Name,
            price: product.Price.Price,
            weight: product.Weight.Weight,
            imageUrl: imageUrlBundle,
            quantity: product.Quantity.Quantity,
            type: 'product' as const,
          };
        } else if (product instanceof BundleEntity) {
          imageUrlBundle = await this.s3Service.getFile(product.Image.Url);
          return {
            id: product.Id.Id,
            name: product.Name.Name,
            price: product.Price.Price,
            weight: product.Weight.Weight,
            imageUrl: imageUrlBundle,
            quantity: product.Quantity.Quantity,
            type: 'bundle' as const,
          };
        }
        return null;
      }).filter(product => product !== null),
    );

    const response: GetBundleIdServiceResponseDto = {
      id: bundleResult.Value.Id.Id,
      name: bundleResult.Value.Name.Name,
      description: bundleResult.Value.Description.Description,
      currency: bundleResult.Value.Currency.Currency,
      price: bundleResult.Value.Price.Price,
      stock: bundleResult.Value.Stock.Stock,
      weight: bundleResult.Value.Weight.Weight,
      imageUrl: imageUrl,
      caducityDate: bundleResult.Value.CaducityDate.CaducityDate,
      products: products,
    };

    return Result.success(response, 200);
  }
}
