export interface GetBundlePageServiceResponseDto {
  bundles: {
    id: string;
    name: string;
    description: string;
    currency: string;
    price: number;
    stock: number;
    weight: number;
    imageUrl: string;
    caducityDate: Date;
  }[];
}
