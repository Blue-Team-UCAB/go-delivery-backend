export interface GetCategoryPageServiceResponseDto {
  categories: {
    id: string;
    name: string;
    imageUrl: string;
  }[];
}
